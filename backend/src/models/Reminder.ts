/**
 * Reminder model for Online Reminder System (MongoDB/Mongoose)
 * Represents a scheduled reminder for a user.
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  userId: string;
  title: string;
  description?: string;
  remindAt: Date;
  notified: boolean;
  status?: 'queued' | 'sending' | 'failed' | 'sent';
  sentAt?: Date;
  lastError?: string;
  attempts?: number;
}

const ReminderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  remindAt: { type: Date, required: true },
  notified: { type: Boolean, default: false },
  status: { type: String, enum: ['queued', 'sending', 'failed', 'sent'], default: 'queued' },
  sentAt: { type: Date },
  lastError: { type: String },
  attempts: { type: Number, default: 0 }
});

export const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema);
