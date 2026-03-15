const pool = require('../config/db');

/** Convert a MySQL DATETIME (JS Date) to ISO-8601 string */
function formatDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

/** Parse a MySQL JSON column that may arrive as object or string */
function parseJsonCol(value) {
  if (!value) return {};
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return {}; }
  }
  return value;
}

/** Fetch a full career object including all junction-table arrays */
async function fetchCareer(careerId) {
  const [rows] = await pool.execute(
    'SELECT id, name, description, icon, salary_range, education_required, created_at FROM careers WHERE id = ?',
    [careerId],
  );
  if (rows.length === 0) return null;
  const career = rows[0];

  const [skills]  = await pool.execute('SELECT skill FROM career_skills_required WHERE career_id = ?', [careerId]);
  const [stages]  = await pool.execute('SELECT stage FROM career_academic_stages WHERE career_id = ?', [careerId]);
  const [streams] = await pool.execute('SELECT stream FROM career_streams WHERE career_id = ?', [careerId]);

  career.skills_required  = skills.map(r => r.skill);
  career.academic_stages  = stages.map(r => r.stage);
  career.streams          = streams.map(r => r.stream);
  career.created_at       = formatDate(career.created_at);
  return career;
}

/** Fetch a full user object including skills array */
async function fetchUserById(userId) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, academic_stage, stream, is_admin, created_at FROM users WHERE id = ?',
    [userId],
  );
  if (rows.length === 0) return null;
  const user = rows[0];

  const [skillRows] = await pool.execute('SELECT skill FROM user_skills WHERE user_id = ?', [userId]);
  user.skills    = skillRows.map(r => r.skill);
  user.is_admin  = Boolean(user.is_admin);
  user.created_at = formatDate(user.created_at);
  return user;
}

/** Fetch all progress entries for a user with completed_milestones lists */
async function fetchProgress(userId) {
  const [progressRows] = await pool.execute(
    'SELECT id, user_id, career_id, started_at FROM user_progress WHERE user_id = ?',
    [userId],
  );
  const result = [];
  for (const row of progressRows) {
    const [milestones] = await pool.execute(
      'SELECT milestone_id FROM user_progress_milestones WHERE progress_id = ?',
      [row.id],
    );
    result.push({
      ...row,
      completed_milestones: milestones.map(m => m.milestone_id),
      started_at: formatDate(row.started_at),
    });
  }
  return result;
}

/** Assemble nested question → options → career_weights structure */
async function fetchQuestions() {
  const [rows] = await pool.execute(`
    SELECT q.id AS q_id, q.text AS q_text, q.display_order AS q_order,
           o.id AS o_id, o.text AS o_text, o.display_order AS o_order,
           w.career_id, w.weight
    FROM questions q
    JOIN question_options o ON q.id = o.question_id
    LEFT JOIN question_option_career_weights w ON o.id = w.option_id
    ORDER BY q.display_order, q.id, o.display_order, o.id
  `);

  const questionsMap = {};
  for (const row of rows) {
    if (!questionsMap[row.q_id]) {
      questionsMap[row.q_id] = { id: row.q_id, text: row.q_text, _order: row.q_order, options: {} };
    }
    if (!questionsMap[row.q_id].options[row.o_id]) {
      questionsMap[row.q_id].options[row.o_id] = {
        id: row.o_id, text: row.o_text, _order: row.o_order, career_weights: {},
      };
    }
    if (row.career_id) {
      questionsMap[row.q_id].options[row.o_id].career_weights[row.career_id] = row.weight;
    }
  }

  return Object.values(questionsMap)
    .sort((a, b) => a._order - b._order)
    .map(q => ({
      id: q.id,
      text: q.text,
      options: Object.values(q.options)
        .sort((a, b) => a._order - b._order)
        .map(o => ({ id: o.id, text: o.text, career_weights: o.career_weights })),
    }));
}

module.exports = { formatDate, parseJsonCol, fetchCareer, fetchUserById, fetchProgress, fetchQuestions };
