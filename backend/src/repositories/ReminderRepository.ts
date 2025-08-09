import { Reminder, IReminder } from '../models/Reminder';

export class ReminderRepository {
  findByUser(userId: string) {
    return Reminder.find({ userId });
  }
  findOneByIdForUser(id: string, userId: string) {
    return Reminder.findOne({ _id: id, userId });
  }
  create(data: Partial<IReminder>) {
    const r = new Reminder(data);
    return r.save();
  }
  deleteByIdForUser(id: string, userId: string) {
    return Reminder.deleteOne({ _id: id, userId });
  }
  updateByIdForUser(id: string, userId: string, update: Partial<IReminder>) {
    return Reminder.findOneAndUpdate({ _id: id, userId }, update, { new: true });
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
