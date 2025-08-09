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

  async patchReminder(id: string, userId: string, patch: Partial<IReminder>) {
    // Only allow updating specific fields
    const allowed: Partial<IReminder> = {} as any;
    if (patch.title !== undefined) allowed.title = patch.title;
    if (patch.description !== undefined) allowed.description = patch.description;
    if (patch.remindAt !== undefined) allowed.remindAt = new Date(patch.remindAt);

    // Requeue: allow client to set status back to 'queued' and reset failure
    if (patch.status === 'queued') {
      allowed.status = 'queued' as any;
      (allowed as any).lastError = undefined;
    }

    // Do not allow direct transitions to sent/sending/notified via API
    if (patch.status && patch.status !== 'queued') {
      throw new Error('Only status=queued is allowed via PATCH.');
    }

    const updated = await this.repo.updateByIdForUser(id, userId, allowed);
    return updated;
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
