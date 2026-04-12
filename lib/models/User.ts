import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
});

export const User = models.User || model('User', UserSchema);
