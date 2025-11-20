import express from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/create',auth, async (req,res)=>{
  try {
    const { parking_id, vehicle_type, hours } = req.body;

    if(!parking_id || !vehicle_type || !hours){
      return res.status(400).json({error: "Missing required fields"});
    }

    const priceQ = `SELECT price_2w_per_hour, price_4w_per_hour FROM parking_locations WHERE id=$1`;
    const q = await pool.query(priceQ, [parking_id]); 

    if(q.rows.length === 0){
      return res.status(404).json({error: "Parking location not found"});
    }

    const row = q.rows[0]; // <-- correct row extraction

    const rate = vehicle_type === "2W" ? row.price_2w_per_hour : row.price_4w_per_hour;
    const total_amount = rate * hours;

    const user_id = req.user.id;

    const insertQ = `INSERT INTO bookings 
      (user_id, parking_id, vehicle_type, hours, total_amount)
      VALUES ($1,$2,$3,$4,$5) RETURNING *`;

    const result = await pool.query(insertQ, [user_id,parking_id,vehicle_type,hours,total_amount]);

    return res.json({ success: true, booking: result.rows[0] });

  } catch(err) {
    console.log("booking error:", err);
    return res.status(500).json({error: err.message});
  }
});

router.get("/my",async(req,res)=>
{
  try {
    const q= `
    SELECT b.id, b.vehicle_type, b.hours, b.total_amount, b.created_at,
             p.name AS parking_name, p.address
      FROM bookings b
      JOIN parking_locations p ON b.parking_id = p.id
      ORDER BY b.created_at DESC;
    `;
    const result = await pool.query(q);
    return res.json( result.rows);


  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({error: "Internal server error"});
  }
});


export default router;
