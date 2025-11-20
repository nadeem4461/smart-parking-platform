import express from 'express';
import {pool } from '../db.js';
import jwt from 'jsonwebtoken';
import {getFilteredParking } from "../controllers/parkingController.js";
const router = express.Router();

function verifyOwner(req, res, next){
    try {
        const token= req.headers.authorization.split(' ')[1];
        if(!token) return res.status(401).json({error:'no token provided'});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !=='owner'){
            return res.status(403).json({error:'owner access only'});
        }
        req.owner_id = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({error:'invalid token'});
    }
}

router.get('/',getFilteredParking);


// owner add parking 
 router.post('/add',verifyOwner,async(req, res)=>
{
    const {name,address, latitude, longitude,two_wheeler_slots, four_wheeler_slots,price_2w_per_hour, price_4w_per_hour} = req.body;
    try {
        const result= await pool.query(
            "insert into parking_locations(owner_id,name, address, latitude, longitude, two_wheeler_slots, four_wheeler_slots, price_2w_per_hour, price_4w_per_hour) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id",
            [req.owner_id, name, address, latitude, longitude, two_wheeler_slots, four_wheeler_slots, price_2w_per_hour, price_4w_per_hour]
        );
        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({error:error.message});
    }

})


// user view list
router.get('/list',async(req,res)=>{
    const result = await pool.query(
        "select * from parking_locations"
    );
    res.json(result.rows);
});

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

router.get('/filter',async(req,res)=>
{
    try {
        const {lat,lng,vehicle_type='',priceMin,priceMax,sort='distance'} = req.query;
        if(!lat || !lng)
        {
            return res.status(400).json({error:'lat and lng are required'});
        }
        const where=[];
        const params=[lat,lng];
        
        if(vehicle_type=='2W'){
            where.push('two_wheeler_slots > 0');
        }else if(vehicle_type=='4W'){
            where.push('four_wheeler_slots > 0');
        }
        
        if(priceMin)
        {
            params.push(priceMin);
            where.push('(price_2w_per_hour>=$'+params.length+' OR price_4w_per_hour>=$'+params.length+')');
        }
        if(priceMax)
        {
            params.push(priceMax);
            where.push('(price_2w_per_hour<=$'+params.length+' OR price_4w_per_hour<=$'+params.length+')');
        }
        const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';


        let orderBy = 'distance_km ASC';
        if(sort==='cheap')
        {
            orderBy = 'LEAST(COALESCE(price_2w_per_hour,1e9), COALESCE(price_4w_per_hour,1e9)) ASC';
        }
        else if (sort ==='max')
        {
            orderBy = 'LEAST(coalesce(two_wheeler_slots,0), coalesce(four_wheeler_slots,0)) DESC';
        }

        const q= 
        `
        select id, name, address, latitude, longitude,
        two_wheeler_slots, four_wheeler_slots,
        price_2w_per_hour, price_4w_per_hour,
          6371 * acos(
               cos(radians($1)) * cos(radians(latitude)) *
               cos(radians(longitude) - radians($2)) +
               sin(radians($1)) * sin(radians(latitude))
             ) AS distance_km 
              from parking_locations
              ${whereSql}
                order by ${orderBy}
                limit 50 
        `;
        const {rows}= await pool.query(q,params);
        res.json(rows);


    } catch (error) {
        console.error('Error filtering parking:', error);
        res.status(500).json({ error: error.message });
    }
})

export default router;