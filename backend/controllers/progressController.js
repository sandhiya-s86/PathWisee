const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { fetchProgress } = require('../utils/helpers');

// POST /api/progress/update  (auth required)
async function updateProgress(req, res, next) {
  try {
    const { user_id, career_id, milestone_id } = req.body;
    if (!user_id || !career_id || !milestone_id) {
      return res.status(422).json({ detail: 'user_id, career_id and milestone_id are required' });
    }
    if (user_id !== req.user.id) return res.status(403).json({ detail: 'Unauthorized' });

    const [existing] = await pool.execute(
      'SELECT id FROM user_progress WHERE user_id = ? AND career_id = ?',
      [user_id, career_id],
    );

    let progressId;
    if (existing.length > 0) {
      progressId = existing[0].id;
    } else {
      progressId = uuidv4();
      await pool.execute(
        'INSERT INTO user_progress (id, user_id, career_id, started_at) VALUES (?, ?, ?, ?)',
        [progressId, user_id, career_id, new Date()],
      );
    }

    // INSERT IGNORE silently skips if milestone already recorded
    await pool.execute(
      'INSERT IGNORE INTO user_progress_milestones (progress_id, milestone_id) VALUES (?, ?)',
      [progressId, milestone_id],
    );

    res.json({ message: 'Progress updated' });
  } catch (err) { next(err); }
}

// GET /api/progress/:user_id  (auth required)
async function getProgress(req, res, next) {
  try {
    const { user_id } = req.params;
    if (user_id !== req.user.id) return res.status(403).json({ detail: 'Unauthorized' });
    res.json(await fetchProgress(user_id));
  } catch (err) { next(err); }
}

module.exports = { updateProgress, getProgress };
