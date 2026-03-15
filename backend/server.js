require('dotenv').config();
const app  = require('./app');
const pool = require('./config/db');

const PORT = parseInt(process.env.PORT || '8001', 10);

async function start() {
  try {
    // Verify DB connection before accepting traffic
    const conn = await pool.getConnection();
    console.log('✓ MySQL connected successfully');
    conn.release();

    app.listen(PORT, () => {
      console.log(`✓ PathWise API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Failed to connect to MySQL:', err.message);
    process.exit(1);
  }
}

start();
