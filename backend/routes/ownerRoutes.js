import express from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// ✅ FIXED OWNER MIDDLEWARE
function requireOwner(req, res, next) {
  const role = req.user?.role;

  // CORRECT LOGIC:
  if (!role || (role !== "owner" && role !== "admin")) {
    return res.status(403).json({ error: "Forbidden: owner access only" });
  }

  next();
}

// ----------------------------------------------------------------------
// ✅ GET OWNER PARKINGS
// ----------------------------------------------------------------------
router.get('/parkings', auth, requireOwner, async (req, res) => {
  try {
    const q = `
      SELECT * FROM parking_locations
      WHERE owner_id = $1
      ORDER BY id DESC
    `;
    const result = await pool.query(q, [req.user.id]);

    res.json({ parkings: result.rows });

  } catch (err) {
    console.error('owner parkings error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------------------------------------------------------
// ✅ GET OWNER BOOKINGS
// ----------------------------------------------------------------------
router.get('/bookings', auth, requireOwner, async (req, res) => {
  try {
    const q = `
      SELECT 
        b.id, b.user_id, b.parking_id, b.vehicle_type, b.hours, 
        b.total_amount, b.status, b.created_at,
        p.name AS parking_name,
        u.name AS user_name
      FROM bookings b
      JOIN parking_locations p ON b.parking_id = p.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE p.owner_id = $1
      ORDER BY b.created_at DESC
      LIMIT 200;
    `;

    const result = await pool.query(q, [req.user.id]);

    res.json({ bookings: result.rows });

  } catch (err) {
    console.error('owner bookings error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------------------------------------------------------
// ✅ GET OWNER EARNINGS (LAST X DAYS)
// ----------------------------------------------------------------------
router.get('/earnings', auth, requireOwner, async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;

    const q = `
      SELECT 
        to_char(b.created_at::date, 'YYYY-MM-DD') AS day,
        SUM(b.total_amount) AS total_amount,
        COUNT(*) AS bookings_count
      FROM bookings b
      JOIN parking_locations p ON b.parking_id = p.id
      WHERE p.owner_id = $1
        AND b.created_at >= (CURRENT_DATE - $2::INT)
      GROUP BY day
      ORDER BY day ASC;
    `;

    const result = await pool.query(q, [req.user.id, days]);

    const totalQ = `
      SELECT 
        COALESCE(SUM(b.total_amount), 0) AS total_earnings,
        COUNT(*) AS total_bookings
      FROM bookings b
      JOIN parking_locations p ON b.parking_id = p.id
      WHERE p.owner_id = $1;
    `;

    const totals = await pool.query(totalQ, [req.user.id]);

    res.json({
      per_day: result.rows,
      totals: totals.rows[0],
    });

  } catch (err) {
    console.error('owner earnings error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
