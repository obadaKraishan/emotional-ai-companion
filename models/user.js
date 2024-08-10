import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  preferences: {
    moodTracking: { type: Boolean, default: true },
    personalizedResponses: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
