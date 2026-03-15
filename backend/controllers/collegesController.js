const pool = require('../config/db');
const { parseJsonCol } = require('../utils/helpers');

function formatCollege(row) {
  return { id: row.id, name: row.name, state: row.state, ...parseJsonCol(row.data) };
}

// GET /api/colleges
async function getColleges(req, res, next) {
  try {
    const { state, exam } = req.query;
    const conditions = [];
    const params = [];

    if (state) { conditions.push('state = ?'); params.push(state); }
    if (exam) {
      conditions.push('id IN (SELECT college_id FROM college_exam_relations WHERE exam_id = ?)');
      params.push(exam);
    }

    const where = conditions.length ? conditions.join(' AND ') : '1=1';
    const [rows] = await pool.execute(
      `SELECT id, name, state, data FROM colleges WHERE ${where}`, params,
    );
    res.json(rows.map(formatCollege));
  } catch (err) { next(err); }
}

// GET /api/colleges/:college_id
async function getCollege(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, state, data FROM colleges WHERE id = ?',
      [req.params.college_id],
    );
    if (rows.length === 0) return res.status(404).json({ detail: 'College not found' });
    res.json(formatCollege(rows[0]));
  } catch (err) { next(err); }
}

module.exports = { getColleges, getCollege };
