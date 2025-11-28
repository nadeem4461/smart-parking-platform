import express from 'express';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024}}); // 5MB limit
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


function uploadToCloudinary(buffer, folder  = 'smartpark') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {folder},
      (error, result) => {  
        if(error) return reject(error);
        resolve(result);
      });
            streamifier.createReadStream(buffer).pipe(uploadStream);
  });


}

router.post('/parkings',auth, requireOwner, upload.single('image'), async (req, res) => {
  try {
    const {name , address,latitude,longitude, capacity_2w , capacity_4w, price_2w_per_hour , price_4w_per_hour } = req.body;
        if (!name) return res.status(400).json({ error: 'Parking name is required' });

        let imageUrl = null;
        if(req.file && req.file.buffer){
          const result = await uploadToCloudinary(req.file.buffer);
          imageUrl = result.secure_url;
        }  

 const insertQ = `
  INSERT INTO parking_locations
  (owner_id, name, address, latitude, longitude,
   two_wheeler_slots, four_wheeler_slots,
   price_2w_per_hour, price_4w_per_hour, image_url)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  RETURNING *;
`;

const values = [
  req.user.id,
  name,
  address || null,
  latitude ? parseFloat(latitude) : null,
  longitude ? parseFloat(longitude) : null,
  capacity_2w ? parseInt(capacity_2w) : 0,     // mapped to two_wheeler_slots
  capacity_4w ? parseInt(capacity_4w) : 0,     // mapped to four_wheeler_slots
  price_2w_per_hour ? parseFloat(price_2w_per_hour) : 0,
  price_4w_per_hour ? parseFloat(price_4w_per_hour) : 0,
  imageUrl
];

        const {rows}= await pool.query(insertQ,values);
        res.status(201).json({parking:rows[0]});

      } catch (err) {
    console.error('owner add parking error', err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/parkings/:id',auth,requireOwner, upload.single('image'), async(req, res)=>{
  console.log("PUT /parking/:id called");
  try {
      const id = req.params.id;
      const {
        name , 
        address, 
        latitude, 
        longitude,
        two_wheeler_slots ,
        four_wheeler_slots,
        price_2w_per_hour ,
        price_4w_per_hour ,

      }=req.body;
      let imageUrl = req.body.image_url || null;
      if(req.file && req.file.buffer){
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;

      }
      const q= `
      update parking_locations
      set name = $1, 
      address= $2,
      latitude= $3,
      longitude= $4,
      two_wheeler_slots= $5,
      four_wheeler_slots= $6,
      price_2w_per_hour= $7,
      price_4w_per_hour= $8,
      image_url = $9
      where id = $10 AND owner_id = $11
      returning *;

      `;
      const values = [
         name , 
         address,
         latitude,
          longitude,
          two_wheeler_slots,
          four_wheeler_slots,
          price_2w_per_hour,
          price_4w_per_hour,
          imageUrl, 
          id , 
          req.user.id

      ] ;
      const result= await pool.query(q,values);
      if(result.rows.length===0){
        return res.status(404).json({error:'parking not found or unaithorized'});
      }
        res.json({parking:result.rows[0]});

  } catch (err) {
      console.error("edit parking error", err);
    res.status(500).json({ error: "Server error" })
  }

})
router.delete('/parkings/:id', auth , requireOwner, async(req,res)=>{
  try {
    const id= req.params.id;
    const q= `
    DELETE FROM parking_locations
    where id = $1 and owner_id = $2 returning *`;
    const result =await pool.query(q,[id, req.user.id]);
    if(result.rows.length===0){
      return res.status(404).json({error:'parking not found or unaithorized'});

    }
    res.json({message:'parking deleted successfully'});
  } catch (err) {
    console.error('delete parking error', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
