import { IReminder } from '../models/Reminder';
import { ReminderRepository } from '../repositories/ReminderRepository';
import { IEmailService } from './email/IEmailService';

export class ReminderService {
  constructor(private repo: ReminderRepository, private email: IEmailService) {}

  getReminders(userId: string) {
    return this.repo.findByUser(userId);
  }

  async createReminder(userId: string, title: string, description: string | undefined, remindAt: Date) {
    return this.repo.create({ userId, title, description, remindAt, status: 'queued', notified: false, attempts: 0 });
  }

  deleteReminder(id: string, userId: string) {
    return this.repo.deleteByIdForUser(id, userId);
  }

  async processDue(now: Date) {
    const due = await this.repo.findDue(now);
    for (const reminder of due) {
      const user = await (await import('../models/User')).User.findById(reminder.userId);
      if (!user?.email) continue;
      await this.markSending(reminder);
      try {
        await this.email.send(
          user.email,
          `Reminder: ${reminder.title}`,
          reminder.description || 'You have a scheduled reminder.'
        );
        await this.markSent(reminder);
      } catch (err) {
        await this.markFailed(reminder, err);
      }
    }
  }

  private async markSending(reminder: IReminder) {
    reminder.status = 'sending';
    reminder.attempts = (reminder.attempts || 0) + 1;
    reminder.lastError = undefined;
    await reminder.save();
  }

  private async markSent(reminder: IReminder) {
    reminder.notified = true;
    reminder.status = 'sent';
    reminder.sentAt = new Date();
    await reminder.save();
  }

  private async markFailed(reminder: IReminder, err: unknown) {
    reminder.status = 'failed';
    reminder.lastError = String((err as any)?.message || err);
    await reminder.save();
  }
}
