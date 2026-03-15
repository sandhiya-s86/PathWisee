const pool = require('../config/db');
const { parseJsonCol } = require('../utils/helpers');

function formatExam(row) {
  return { id: row.id, name: row.name, category: row.category, ...parseJsonCol(row.data) };
}

// GET /api/exams
async function getExams(req, res, next) {
  try {
    const { category } = req.query;
    const [rows] = category
      ? await pool.execute('SELECT id, name, category, data FROM entrance_exams WHERE category = ?', [category])
      : await pool.execute('SELECT id, name, category, data FROM entrance_exams');
    res.json(rows.map(formatExam));
  } catch (err) { next(err); }
}

// GET /api/exams/:exam_id
async function getExam(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, category, data FROM entrance_exams WHERE id = ?',
      [req.params.exam_id],
    );
    if (rows.length === 0) return res.status(404).json({ detail: 'Exam not found' });
    res.json(formatExam(rows[0]));
  } catch (err) { next(err); }
}

module.exports = { getExams, getExam };
