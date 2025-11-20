import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT id, name, address, latitude, longitude,
             two_wheeler_slots, four_wheeler_slots,
             price_2w_per_hour, price_4w_per_hour,
             (6371 * acos(
                cos(radians($1)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians($2)) +
                sin(radians($1)) * sin(radians(latitude))
             )) AS distance_km
      FROM parking_locations
      ORDER BY distance_km ASC
      LIMIT 20;
      `,
      [lat, lng]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching nearby parking:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
