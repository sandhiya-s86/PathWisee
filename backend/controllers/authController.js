const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool    = require('../config/db');
const { fetchUserById, formatDate } = require('../utils/helpers');

const JWT_SECRET          = process.env.JWT_SECRET || 'pathwise-secret-key-change-in-production';
const JWT_EXPIRATION      = '72h';
const ADMIN_EMAIL         = process.env.ADMIN_EMAIL;

function createToken(userId, email) {
  return jwt.sign({ user_id: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, academic_stage = null, stream = null } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ detail: 'name, email and password are required' });
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ detail: 'Email already registered' });
    }

    const userId   = uuidv4();
    const isAdmin  = email === ADMIN_EMAIL;
    const hashed   = await bcrypt.hash(password, 10);
    const createdAt = new Date();

    await pool.execute(
      'INSERT INTO users (id, name, email, password, academic_stage, stream, is_admin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashed, academic_stage, stream, isAdmin, createdAt],
    );

    const token = createToken(userId, email);
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, name, email, academic_stage, stream, is_admin: isAdmin },
    });
  } catch (err) { next(err); }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ detail: 'email and password are required' });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email, password, academic_stage, stream, is_admin FROM users WHERE email = ?',
      [email],
    );
    if (rows.length === 0) {
      return res.status(401).json({ detail: 'Invalid credentials' });
    }
    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ detail: 'Invalid credentials' });

    const [skillRows] = await pool.execute('SELECT skill FROM user_skills WHERE user_id = ?', [user.id]);
    const token = createToken(user.id, user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id, name: user.name, email: user.email,
        academic_stage: user.academic_stage, stream: user.stream,
        skills: skillRows.map(r => r.skill),
        is_admin: Boolean(user.is_admin),
      },
    });
  } catch (err) { next(err); }
}

// GET /api/auth/profile
async function getProfile(req, res) {
  const u = req.user;
  res.json({
    id: u.id, name: u.name, email: u.email,
    academic_stage: u.academic_stage, stream: u.stream,
    skills: u.skills, is_admin: u.is_admin, created_at: u.created_at,
  });
}

// PUT /api/auth/profile
async function updateProfile(req, res, next) {
  try {
    const { academic_stage, stream, skills } = req.body;
    const userId = req.user.id;

    const scalarUpdates = {};
    if (academic_stage !== undefined && academic_stage !== null) scalarUpdates.academic_stage = academic_stage;
    if (stream !== undefined && stream !== null) scalarUpdates.stream = stream;

    if (Object.keys(scalarUpdates).length > 0) {
      const setClause = Object.keys(scalarUpdates).map(k => `${k} = ?`).join(', ');
      const params = [...Object.values(scalarUpdates), userId];
      await pool.execute(`UPDATE users SET ${setClause} WHERE id = ?`, params);
    }

    if (Array.isArray(skills)) {
      await pool.execute('DELETE FROM user_skills WHERE user_id = ?', [userId]);
      if (skills.length > 0) {
        const placeholders = skills.map(() => '(?, ?)').join(', ');
        const vals = skills.flatMap(s => [userId, s]);
        await pool.execute(
          `INSERT IGNORE INTO user_skills (user_id, skill) VALUES ${placeholders}`, vals,
        );
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) { next(err); }
}

module.exports = { register, login, getProfile, updateProfile };
