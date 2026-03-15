const pool = require('../config/db');
const { fetchCareer, parseJsonCol, formatDate } = require('../utils/helpers');

// GET /api/careers
async function getCareers(req, res, next) {
  try {
    const { academic_stage, stream } = req.query;
    const conditions = [];
    const params = [];

    if (academic_stage) {
      conditions.push('id IN (SELECT career_id FROM career_academic_stages WHERE stage = ?)');
      params.push(academic_stage);
    }
    if (stream) {
      conditions.push('id IN (SELECT career_id FROM career_streams WHERE stream = ?)');
      params.push(stream);
    }

    const where = conditions.length ? conditions.join(' AND ') : '1=1';
    const [rows] = await pool.execute(
      `SELECT id, name, description, icon, salary_range, education_required, created_at FROM careers WHERE ${where}`,
      params,
    );

    if (rows.length === 0) return res.json([]);

    const careerIds = rows.map(r => r.id);
    const ph = careerIds.map(() => '?').join(', ');

    const [[skillRows], [stageRows], [streamRows]] = await Promise.all([
      pool.execute(`SELECT career_id, skill FROM career_skills_required WHERE career_id IN (${ph})`, careerIds),
      pool.execute(`SELECT career_id, stage FROM career_academic_stages WHERE career_id IN (${ph})`, careerIds),
      pool.execute(`SELECT career_id, stream FROM career_streams WHERE career_id IN (${ph})`, careerIds),
    ]);

    const skillsMap = {}, stagesMap = {}, streamsMap = {};
    for (const s of skillRows)  { if (!skillsMap[s.career_id])  skillsMap[s.career_id]  = []; skillsMap[s.career_id].push(s.skill); }
    for (const s of stageRows)  { if (!stagesMap[s.career_id])  stagesMap[s.career_id]  = []; stagesMap[s.career_id].push(s.stage); }
    for (const s of streamRows) { if (!streamsMap[s.career_id]) streamsMap[s.career_id] = []; streamsMap[s.career_id].push(s.stream); }

    res.json(rows.map(row => ({
      ...row,
      created_at:      formatDate(row.created_at),
      skills_required: skillsMap[row.id]  || [],
      academic_stages: stagesMap[row.id]  || [],
      streams:         streamsMap[row.id] || [],
    })));
  } catch (err) { next(err); }
}

// GET /api/careers/:career_id
async function getCareer(req, res, next) {
  try {
    const career = await fetchCareer(req.params.career_id);
    if (!career) return res.status(404).json({ detail: 'Career not found' });
    res.json(career);
  } catch (err) { next(err); }
}

// GET /api/careers/:career_id/roadmap
async function getCareerRoadmap(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, career_id, content FROM roadmaps WHERE career_id = ?',
      [req.params.career_id],
    );
    if (rows.length === 0) return res.status(404).json({ detail: 'Roadmap not found' });
    const row = rows[0];
    res.json({ id: row.id, career_id: row.career_id, ...parseJsonCol(row.content) });
  } catch (err) { next(err); }
}

// GET /api/careers/:career_id/exams
async function getCareerExams(req, res, next) {
  try {
    const [examIds] = await pool.execute(
      'SELECT exam_id FROM exam_career_relations WHERE career_id = ?',
      [req.params.career_id],
    );
    if (examIds.length === 0) return res.json([]);

    const placeholders = examIds.map(() => '?').join(', ');
    const ids = examIds.map(r => r.exam_id);
    const [rows] = await pool.execute(
      `SELECT id, name, category, data FROM entrance_exams WHERE id IN (${placeholders})`, ids,
    );
    res.json(rows.map(r => ({ id: r.id, name: r.name, category: r.category, ...parseJsonCol(r.data) })));
  } catch (err) { next(err); }
}

// GET /api/careers/:career_id/colleges
async function getCareerColleges(req, res, next) {
  try {
    const [collegeIds] = await pool.execute(
      'SELECT college_id FROM college_career_relations WHERE career_id = ?',
      [req.params.career_id],
    );
    if (collegeIds.length === 0) return res.json([]);

    const placeholders = collegeIds.map(() => '?').join(', ');
    const ids = collegeIds.map(r => r.college_id);
    const [rows] = await pool.execute(
      `SELECT id, name, state, data FROM colleges WHERE id IN (${placeholders})`, ids,
    );
    res.json(rows.map(r => ({ id: r.id, name: r.name, state: r.state, ...parseJsonCol(r.data) })));
  } catch (err) { next(err); }
}

module.exports = { getCareers, getCareer, getCareerRoadmap, getCareerExams, getCareerColleges };
