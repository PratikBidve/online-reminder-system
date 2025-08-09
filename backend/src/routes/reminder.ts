/**
 * Reminder routes for Online Reminder System
 * Protected by JWT middleware.
 */
import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { createReminder, getReminders, deleteReminder, patchReminder } from '../controllers/reminderController';

const router = express.Router();

router.post('/', authenticateJWT, createReminder);
router.get('/', authenticateJWT, getReminders);
router.patch('/:id', authenticateJWT, patchReminder);
router.delete('/:id', authenticateJWT, deleteReminder);

export default router;