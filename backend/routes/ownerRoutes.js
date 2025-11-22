import express from 'express';
import {pool} from '../db.js';
import {auth} from '../middleware/auth.js';

const router = express.Router();

function requireOwner(req, res, next) {
    const role = req.user?.role;
    if(!role || role !== 'owner' && role !== 'admin') {
        return res.status(403).json({error: 'Forbidden: owner access only'});
    }
    next();
}

router.get('/parkings',auth,requireOwner, async (req,res)=>{
    try{
        const q =`select  * from parking_locations where owner_id=$1 order by id desc`;
        const result = await pool.query(q,[req.user.id]);
        res.json({parkings: result.rows});
    } catch (err) {
    console.error('owner parkings error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/bookings",auth,requireOwner, async (req,res)=>{
    try {
        const q = `
      SELECT b.id, b.user_id, b.parking_id, b.vehicle_type, b.hours, b.total_amount, b.status, b.created_at,
             p.name as parking_name, u.name as user_name
      FROM bookings b
      JOIN parking_locations p ON b.parking_id = p.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE p.owner_id = $1
      ORDER BY b.created_at DESC
      LIMIT 200;
    `;
    const result = await pool.query(q, [req.user.id]);
    res.json({ bookings: result.rows });
    } catch (error) {
        console.error('owner bookings error', error);
    res.status(500).json({ error: 'Server error' });
    }
});

router.get('/earnings',auth,requireOwner,async(req,res)=>{
    try {
        const days= Number(req.query.days)|| 30;
        const q = `
      SELECT
        to_char(b.created_at::date, 'YYYY-MM-DD') as day,
        sum(b.total_amount) as total_amount,
        count(*) as bookings_count
      FROM bookings b
      JOIN parking_locations p ON b.parking_id = p.id
      WHERE p.owner_id = $1
        AND b.created_at >= (current_date - $2::int)
      GROUP BY day
      ORDER BY day ASC;
    `;
    const result = await pool.query(q, [req.user.id, days]);
   const totalQ = `
      SELECT COALESCE(sum(b.total_amount),0) as total_earnings, COUNT(*) as total_bookings
      FROM bookings b
      JOIN parking_locations p ON b.parking_id = p.id
      WHERE p.owner_id = $1;
    `;
    const totals= await pool.query(totalQ, [req.user.id]);
    res.json({per_day:result.rows,totals:totals.rows[0]});
    } catch (err) {
    console.error('owner earnings error', err);
    res.status(500).json({ error: 'Server error' });
  }
});
export default router;
