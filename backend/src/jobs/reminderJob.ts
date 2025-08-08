/**
 * Scheduled job to send due reminder emails using node-cron.
 */
import cron from 'node-cron';
import { Reminder } from '../models/Reminder';
import { ReminderService } from '../services/ReminderService';
import { ReminderRepository } from '../repositories/ReminderRepository';
import { NodemailerEmailService } from '../services/email/NodemailerEmailService';

// Runs every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  console.log(`[ReminderJob] Checking for due reminders at ${now.toISOString()}`);
  try {
    const service = new ReminderService(new ReminderRepository(), new NodemailerEmailService());
    await service.processDue(now);
  } catch (err) {
    console.error('[ReminderJob] Error while processing reminders:', err);
  }
});
