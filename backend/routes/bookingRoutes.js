import express from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
    const { parking_id, vehicle_type, qty, start_time, end_time } = req.body;

    if (!parking_id || !vehicle_type || !qty || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const qtyNum = parseInt(qty);
    console.log("Quantity:", qtyNum);
    if (qtyNum <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }
    const start = new Date(start_time);
    const end = new Date(end_time);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: "Invalid start or end time" });
    }
    const priceQ = `SELECT two_wheeler_slots, four_wheeler_slots, ev_slots, price_2w_per_hour, price_4w_per_hour, price_ev_per_hour FROM parking_locations WHERE id=$1 limit 1`;
    const parkRes = await pool.query(priceQ, [parking_id]);
    if (parkRes.rows.length === 0) {
      return res.status(404).json({ error: "Parking location not found" });
    }
    console.log("Parking ID:", parking_id);

    const p = parkRes.rows[0];
    let capacity = 0;
    if (vehicle_type === "2W") capacity = p.two_wheeler_slots;
    else if (vehicle_type === "4W") capacity = p.four_wheeler_slots;
    else if (vehicle_type === "EV") capacity = p.ev_slots;

    if (!capacity || capacity <= 0) {
      return res.status(400).json({ error: 'No capacity configured for this vehicle type' });
    }

    const overlapQ =
      `
    select COALESCE(sum(qty),0) as used_slots
    from bookings
    where parking_id=$1
    and vehicle_type=$2
    and not (end_time <= $3 or start_time >= $4)
    ` ;
    const overlapRes = await pool.query(overlapQ, [parking_id, vehicle_type, start, end]);

    const usedSlots = parseInt(overlapRes.rows[0].used_slots || 0);
    const available = capacity - usedSlots;
    if (qtyNum > available) {
      return res.status(400).json({
        error: `Only ${available} slots available for this time range`,
      });
    }
    const msdiff = end.getTime() - start.getTime();
    const hours = msdiff / (1000 * 60 * 60);

    if (hours <= 0) {
      return res.status(400).json({ error: "time range must be at least 1 hour" });

    }
    let rate = 0;
    if (vehicle_type === "2W") rate = p.price_2w_per_hour;
    else if (vehicle_type === "4W") rate = p.price_4w_per_hour;
    else if (vehicle_type === "EV") rate = p.price_ev_per_hour;
    const total_amount = Math.round(rate * hours * qtyNum);

    const user_id = req.user.id;
    const insertQ = `
      insert into bookings
      (user_id,parking_id , vehicle_type,hours, qty,total_amount, start_time, end_time)
      values($1,$2,$3,$4,$5,$6,$7,$8)
      returning *;
      `;
    const result = await pool.query(insertQ, [
      user_id,
      parking_id,
      vehicle_type,
      hours,
      qtyNum,
      total_amount,
      start,
      end

    ]);
    return res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
});

router.get("/my", async (req, res) => {
  try {
    const q = `
    SELECT b.id, b.vehicle_type, b.hours, b.total_amount, b.created_at,
             p.name AS parking_name, p.address
      FROM bookings b
      JOIN parking_locations p ON b.parking_id = p.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;
    const result = await pool.query(q, [req.user.id]);
    return res.json(result.rows);


  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
