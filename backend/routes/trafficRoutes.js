import express from "express";
import { pool } from "../db.js";
import axios from "axios";

const router = express.Router();

router.get("/route", async (req, res) => {
  try {
    const { from, to } = req.query;

    // Convert "lat,lng" → numbers
    const [fromLat, fromLng] = from.split(",").map(Number);
    const [toLat, toLng] = to.split(",").map(Number);

    // Call OSRM (no API key)
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=polyline`;

    const response = await axios.get(url);
    const route = response.data.routes[0];

    const duration = route.duration; // seconds
    const distance = route.distance; // meters

    // Fake congestion estimator (0–30%)
    const congestion = Math.random() * 0.3;

    const status =
      congestion > 0.2 ? "heavy" : congestion > 0.1 ? "moderate" : "clear";

    // Get 3 nearest parking spots to destination
    const parkQuery = `
      SELECT *,
      (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2))
          + sin(radians($1)) * sin(radians(latitude))
      )) AS distance_km
      FROM parking_locations
      ORDER BY distance_km ASC
      LIMIT 3;
    `;

    const result = await pool.query(parkQuery, [toLat, toLng]);

    res.json({
      status,
      trafficDelay: Math.round(congestion * 100) + "%",
      suggestion:
        status === "heavy"
          ? "Heavy traffic ahead. Park early and continue by metro."
          : "Traffic is normal.",
      parking: result.rows,
      route: route.geometry, // polyline
      distance: (distance / 1000).toFixed(2) + " km",
      duration: (duration / 60).toFixed(1) + " mins",
    });
  } catch (err) {
    console.error("OSRM Error:", err.message);
    res.status(500).json({ error: "Failed to fetch traffic route" });
  }
});

export default router;
