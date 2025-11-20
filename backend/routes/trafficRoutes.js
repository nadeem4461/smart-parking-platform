import express from 'express';
import { pool } from '../db.js';
import axios from 'axios';

const router= express.Router();

router.get("/route",async(req,res)=>
{
    try {
        const {from,to} = req.query;
        const apiKey= process.env.GOOGLE_MAPS_KEY;
        const response= await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&mode=driving&departure_time=now&key=${apiKey}`

        );
        
        const route= response.data.routes[0];
        
        const duration= route.legs[0].duration.value; // in seconds
        const traffic= route.legs[0].duration_in_traffic.value; // in seconds
        const congestion_delay =(traffic - duration)/duration; // in seconds

        const status =
        congestion >0.5?"heavy":
        congestion >0.2?"moderate":
        "Clear";

        const {end_location}= route.legs[0];
        const parkQuery=
        `
        select *,
         (6371 * acos(
        cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude))
      )) AS distance_km 
      FROM parking_locations 
      ORDER BY distance_km ASC 
      LIMIT 3;
        `;
        
        const result = await pool.query(
            parkQuery,
            [end_location.lat,end_location.lng]
        );
        res.json(
            {
                status,
                trafficDelay:Math.round(congestion_delay*100)+"%",
                suggestion :
                status==="heavy" ? 
                "Heavy traffic detected park earlier and continue via metro or rental."
                :"traffic is normal .can continue to destination.",
                parking : result.rows,
                route: route.overview_polyline.points,

            }
        );
    } catch (error) {
         console.error(err);
    res.status(500).json({ error: "Failed to fetch route data" });
        
    }
});
export default router;