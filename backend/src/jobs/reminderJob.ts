/**
 * Scheduled job to send due reminder emails using node-cron.
 */
import cron from 'node-cron';
import { Reminder } from '../models/Reminder';
import { User } from '../models/User';
import { sendReminderEmail } from '../utils/email';

// Runs every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  console.log(`[ReminderJob] Checking for due reminders at ${now.toISOString()}`);
  try {
    const dueReminders = await Reminder.find({
      remindAt: { $lte: now },
      notified: false
    });
    if (dueReminders.length === 0) {
      console.log('[ReminderJob] No due reminders found.');
    }
    for (const reminder of dueReminders) {
      const user = await User.findById(reminder.userId);
      if (user && user.email) {
        console.log(`[ReminderJob] Sending email to ${user.email} for reminder: ${reminder.title}`);
        await sendReminderEmail(
          user.email,
          `Reminder: ${reminder.title}`,
          reminder.description || 'You have a scheduled reminder.'
        );
        reminder.notified = true;
        await reminder.save();
        console.log(`[ReminderJob] Marked reminder as notified: ${reminder._id}`);
      } else {
        console.warn(`[ReminderJob] User not found or missing email for reminder: ${reminder._id}`);
      }
    }
  } catch (err) {
    console.error('[ReminderJob] Error while processing reminders:', err);
  }
});
