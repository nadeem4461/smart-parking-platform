import { pool } from './db.js';

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB OK:', res.rows[0]);
  } catch (err) {
    console.error('DB ERROR:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

test();
