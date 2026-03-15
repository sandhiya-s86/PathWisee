const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { fetchQuestions } = require('../utils/helpers');

// GET /api/assessment/questions
async function getQuestions(req, res, next) {
  try {
    res.json(await fetchQuestions());
  } catch (err) { next(err); }
}

// POST /api/assessment/submit  (auth required)
async function submitAssessment(req, res, next) {
  try {
    const { user_id, responses } = req.body;
    if (!user_id || !responses) {
      return res.status(422).json({ detail: 'user_id and responses are required' });
    }
    if (user_id !== req.user.id) {
      return res.status(403).json({ detail: 'Unauthorized' });
    }

    // Build option → career_weights map
    const [weightRows] = await pool.execute(`
      SELECT o.id AS o_id, w.career_id, w.weight
      FROM question_options o
      LEFT JOIN question_option_career_weights w ON o.id = w.option_id
    `);
    const optionWeights = {};
    for (const row of weightRows) {
      if (!optionWeights[row.o_id]) optionWeights[row.o_id] = {};
      if (row.career_id) optionWeights[row.o_id][row.career_id] = row.weight;
    }

    // Calculate career scores
    const careerScores = {};
    for (const [, optionId] of Object.entries(responses)) {
      for (const [careerId, weight] of Object.entries(optionWeights[optionId] || {})) {
        careerScores[careerId] = (careerScores[careerId] || 0) + weight;
      }
    }

    // Fetch career labels
    const [careerRows] = await pool.execute('SELECT id, name, description, icon FROM careers');
    const careerMap = Object.fromEntries(careerRows.map(c => [c.id, c]));

    // Build top-5 recommendations
    const recommendations = Object.entries(careerScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .filter(([cid]) => careerMap[cid])
      .map(([cid, score]) => ({
        career_id: cid,
        career_name: careerMap[cid].name,
        score: Math.round(score * 10) / 10,
        description: careerMap[cid].description,
        icon: careerMap[cid].icon,
      }));

    // Persist result
    const resultId = uuidv4();
    const timestamp = new Date();
    await pool.execute(
      'INSERT INTO assessment_results (id, user_id, timestamp) VALUES (?, ?, ?)',
      [resultId, req.user.id, timestamp],
    );

    const responseEntries = Object.entries(responses);
    if (responseEntries.length > 0) {
      const placeholders = responseEntries.map(() => '(?, ?, ?)').join(', ');
      const vals = responseEntries.flatMap(([qId, oId]) => [resultId, qId, oId]);
      await pool.execute(
        `INSERT INTO assessment_responses (result_id, question_id, option_id) VALUES ${placeholders}`, vals,
      );
    }

    if (recommendations.length > 0) {
      const placeholders = recommendations.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
      const vals = recommendations.flatMap((r, idx) => [
        resultId, r.career_id, r.career_name, r.score, r.description, r.icon, idx,
      ]);
      await pool.execute(
        `INSERT INTO assessment_recommendations (result_id, career_id, career_name, score, description, icon, rank_order) VALUES ${placeholders}`,
        vals,
      );
    }

    res.json({ recommendations });
  } catch (err) { next(err); }
}

// GET /api/assessment/results/:user_id  (auth required)
async function getResults(req, res, next) {
  try {
    const { user_id } = req.params;
    if (user_id !== req.user.id) return res.status(403).json({ detail: 'Unauthorized' });

    const [latest] = await pool.execute(
      'SELECT id FROM assessment_results WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
      [user_id],
    );
    if (latest.length === 0) return res.json({ recommendations: [] });

    const [recs] = await pool.execute(
      'SELECT career_id, career_name, score, description, icon FROM assessment_recommendations WHERE result_id = ? ORDER BY rank_order',
      [latest[0].id],
    );
    res.json({ recommendations: recs });
  } catch (err) { next(err); }
}

module.exports = { getQuestions, submitAssessment, getResults };
