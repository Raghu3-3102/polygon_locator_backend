// models/PasswordReset.js
import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
   otpExpiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }  // ✅ Correct TTL setting
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("PasswordReset", passwordResetSchema);
