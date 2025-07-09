// models/PendingUser.js
import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }  // ✅ Correct TTL setting
  },
  

}, { timestamps: true });

export default mongoose.model("PendingUser", pendingUserSchema);
