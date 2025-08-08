/**
 * Reminder controller for Online Reminder System
 * Handles CRUD operations for reminders.
 */
import { Request, Response } from 'express';
import { ReminderService } from '../services/ReminderService';
import { ReminderRepository } from '../repositories/ReminderRepository';
import { NodemailerEmailService } from '../services/email/NodemailerEmailService';

const reminderService = new ReminderService(new ReminderRepository(), new NodemailerEmailService());

export const createReminder = async (req: Request, res: Response) => {
  try {
    const { title, description, remindAt } = req.body;
    const userId = (req as any).userId;
  const reminder = await reminderService.createReminder(userId, title, description, new Date(remindAt));
    console.log(`[Reminder] Created for user ${userId}: ${title} at ${remindAt}`);
    res.status(201).json(reminder);
  } catch (error) {
    console.error('[Reminder] Failed to create reminder:', error);
    res.status(500).json({ message: 'Failed to create reminder.', error });
  }
};

export const getReminders = async (req: Request, res: Response) => {
  try {
  const userId = (req as any).userId;
  const reminders = await reminderService.getReminders(userId);
  console.log(`[Reminder] Fetched ${reminders.length} reminders for user ${userId}`);
  res.json(reminders);
  } catch (error) {
    console.error('[Reminder] Failed to fetch reminders:', error);
    res.status(500).json({ message: 'Failed to fetch reminders.', error });
  }
};

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
  await reminderService.deleteReminder(id, userId);
    console.log(`[Reminder] Deleted reminder ${id} for user ${userId}`);
    res.json({ message: 'Reminder deleted.' });
  } catch (error) {
    console.error('[Reminder] Failed to delete reminder:', error);
    res.status(500).json({ message: 'Failed to delete reminder.', error });
  }
};
