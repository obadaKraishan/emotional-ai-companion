import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Ensure password field is defined and required
  preferences: {
    moodTracking: { type: Boolean, default: true },
    personalizedResponses: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
