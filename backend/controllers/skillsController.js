const pool = require('../config/db');
const { parseJsonCol } = require('../utils/helpers');

// GET /api/skills
async function getAllSkills(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT id, name, data FROM skills');
    res.json(rows.map(r => ({ id: r.id, name: r.name, ...parseJsonCol(r.data) })));
  } catch (err) { next(err); }
}

// GET /api/careers/:career_id/skills  (auth required)
async function getCareerSkills(req, res, next) {
  try {
    const [careerRows] = await pool.execute('SELECT id FROM careers WHERE id = ?', [req.params.career_id]);
    if (careerRows.length === 0) return res.status(404).json({ detail: 'Career not found' });

    const [skillNames] = await pool.execute(
      'SELECT skill FROM career_skills_required WHERE career_id = ?', [req.params.career_id],
    );
    if (skillNames.length === 0) return res.json([]);

    const names = skillNames.map(r => r.skill);
    const placeholders = names.map(() => '?').join(', ');
    const [rows] = await pool.execute(
      `SELECT id, name, data FROM skills WHERE name IN (${placeholders})`, names,
    );
    res.json(rows.map(r => ({ id: r.id, name: r.name, ...parseJsonCol(r.data) })));
  } catch (err) { next(err); }
}

// POST /api/user/skills/add  (auth required, query param: skill_name)
async function addUserSkill(req, res, next) {
  try {
    const { skill_name } = req.query;
    if (!skill_name) return res.status(422).json({ detail: 'skill_name query parameter is required' });

    await pool.execute(
      'INSERT IGNORE INTO user_skills (user_id, skill) VALUES (?, ?)',
      [req.user.id, skill_name],
    );
    res.json({ message: 'Skill added' });
  } catch (err) { next(err); }
}

module.exports = { getAllSkills, getCareerSkills, addUserSkill };
