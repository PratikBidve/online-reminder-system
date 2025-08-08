import { Reminder, IReminder } from '../models/Reminder';

export class ReminderRepository {
  findByUser(userId: string) {
    return Reminder.find({ userId });
  }
  create(data: Partial<IReminder>) {
    const r = new Reminder(data);
    return r.save();
  }
  deleteByIdForUser(id: string, userId: string) {
    return Reminder.deleteOne({ _id: id, userId });
  }
  findDue(now: Date) {
    return Reminder.find({
      remindAt: { $lte: now },
      $or: [
        { status: { $in: ['queued', 'failed'] } },
        { status: { $exists: false }, notified: false }
      ]
    });
  }
}
