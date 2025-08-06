/**
 * Authentication routes for Online Reminder System
 * Handles user signup and login with JWT.
 */
import express from 'express';
import { signup, login } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
