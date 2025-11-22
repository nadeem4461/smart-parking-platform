import express from 'express';
import {pool} from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import parkingRoutes from './routes/parkingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import trafficRoutes from './routes/trafficRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/parking',parkingRoutes)
app.use('/booking',bookingRoutes);
app.use('/traffic',trafficRoutes);
app.use('/owner',ownerRoutes);
app.listen(process.env.PORT,()=>
{
    console.log(`Backend server is running on port ${process.env.PORT}`);
    
})

// simple root endpoint
app.get('/', (req, res) => res.send('Backend up'));