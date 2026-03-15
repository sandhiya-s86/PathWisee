const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { formatDate } = require('../utils/helpers');

// GET /api/admin/users
async function getAllUsers(req, res, next) {
  try {
    const [userRows] = await pool.execute(
      'SELECT id, name, email, academic_stage, stream, is_admin, created_at FROM users',
    );

    if (userRows.length === 0) return res.json([]);

    const userIds = userRows.map(u => u.id);
    const ph = userIds.map(() => '?').join(', ');
    const [skillRows] = await pool.execute(
      `SELECT user_id, skill FROM user_skills WHERE user_id IN (${ph})`, userIds,
    );

    const skillsByUser = {};
    for (const s of skillRows) {
      if (!skillsByUser[s.user_id]) skillsByUser[s.user_id] = [];
      skillsByUser[s.user_id].push(s.skill);
    }

    res.json(userRows.map(row => ({
      ...row,
      skills: skillsByUser[row.id] || [],
      is_admin: Boolean(row.is_admin),
      created_at: formatDate(row.created_at),
    })));
  } catch (err) { next(err); }
}

// POST /api/admin/career/create
async function createCareer(req, res, next) {
  try {
    const { name, description, icon, salary_range, skills_required, education_required, academic_stages, streams } = req.body;
    if (!name || !description || !icon || !salary_range || !education_required) {
      return res.status(422).json({ detail: 'name, description, icon, salary_range, and education_required are required' });
    }

    const careerId  = uuidv4();
    const createdAt = new Date();

    await pool.execute(
      'INSERT INTO careers (id, name, description, icon, salary_range, education_required, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [careerId, name, description, icon, salary_range, education_required, createdAt],
    );

    if (Array.isArray(skills_required) && skills_required.length > 0) {
      const ph = skills_required.map(() => '(?, ?)').join(', ');
      await pool.execute(
        `INSERT IGNORE INTO career_skills_required (career_id, skill) VALUES ${ph}`,
        skills_required.flatMap(s => [careerId, s]),
      );
    }
    if (Array.isArray(academic_stages) && academic_stages.length > 0) {
      const ph = academic_stages.map(() => '(?, ?)').join(', ');
      await pool.execute(
        `INSERT IGNORE INTO career_academic_stages (career_id, stage) VALUES ${ph}`,
        academic_stages.flatMap(s => [careerId, s]),
      );
    }
    if (Array.isArray(streams) && streams.length > 0) {
      const ph = streams.map(() => '(?, ?)').join(', ');
      await pool.execute(
        `INSERT IGNORE INTO career_streams (career_id, stream) VALUES ${ph}`,
        streams.flatMap(s => [careerId, s]),
      );
    }

    res.status(201).json({ message: 'Career created successfully', career_id: careerId });
  } catch (err) { next(err); }
}

// DELETE /api/admin/career/:career_id
async function deleteCareer(req, res, next) {
  try {
    const { career_id } = req.params;
    const [result] = await pool.execute('DELETE FROM careers WHERE id = ?', [career_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ detail: 'Career not found' });
    }
    res.json({ message: 'Career deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = { getAllUsers, createCareer, deleteCareer };
