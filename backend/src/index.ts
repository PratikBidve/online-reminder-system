// Start background jobs
import './jobs/reminderJob';
/**
 * Main entry point for the Online Reminder System backend API.
 * Express.js server with TypeScript.
 */

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './utils/db';

const app = express();
app.use(cors());
app.use(express.json());


import { Request, Response } from 'express';

import authRoutes from './routes/auth';
import reminderRoutes from './routes/reminder';


app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Online Reminder System API is running');
});


const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Online Reminder System API running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('[Server] Failed to start server:', err);
});
