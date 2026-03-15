const pool = require('../config/db');
const { fetchProgress } = require('../utils/helpers');

// GET /api/dashboard/:user_id  (auth required)
async function getDashboard(req, res, next) {
  try {
    const { user_id } = req.params;
    if (user_id !== req.user.id) return res.status(403).json({ detail: 'Unauthorized' });

    // Latest assessment recommendations (top 3)
    const [latestRows] = await pool.execute(
      'SELECT id FROM assessment_results WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
      [user_id],
    );
    let latestResults = [];
    if (latestRows.length > 0) {
      const [recs] = await pool.execute(
        'SELECT career_id, career_name, score, description, icon FROM assessment_recommendations WHERE result_id = ? ORDER BY rank_order LIMIT 3',
        [latestRows[0].id],
      );
      latestResults = recs;
    }

    // Progress
    const progressList = await fetchProgress(user_id);
    const totalCompleted = progressList.reduce(
      (sum, p) => sum + p.completed_milestones.length, 0,
    );
    const careerReadiness = Math.min(totalCompleted * 5, 100);

    // Assessment count
    const [[{ cnt }]] = await pool.execute(
      'SELECT COUNT(*) AS cnt FROM assessment_results WHERE user_id = ?', [user_id],
    );

    res.json({
      total_assessments: cnt,
      career_readiness: careerReadiness,
      active_paths: progressList.length,
      skills_acquired: (req.user.skills || []).length,
      latest_results: latestResults,
      progress_data: progressList,
    });
  } catch (err) { next(err); }
}

module.exports = { getDashboard };
