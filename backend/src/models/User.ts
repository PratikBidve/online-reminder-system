/**
 * User model for Online Reminder System
 * Represents a registered user in the system.
 */
import mongoose, { Schema, Document } from 'mongoose';

/**
 * IUser interface extends Mongoose Document for type safety.
 */
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
}

/**
 * Mongoose schema for User collection.
 */
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String }
});

export const User = mongoose.model<IUser>('User', UserSchema);
