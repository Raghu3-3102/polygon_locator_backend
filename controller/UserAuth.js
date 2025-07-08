// controllers/authController.js
import PendingUser from "../models/PendingUser.js";
import ForgotPaaswordPendingUser from "../models/ForgotPaaswordPendingUser.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateOTP, sendEmail } from "../Utility/GenrateOtp.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    

    const tempUser = await PendingUser.create({
      name, email, password,otp, otpExpiresAt
    });

    await sendEmail(email, otp, process.env.MAIL_USER, process.env.MAIL_PASS);

    res.status(200).json({ success: true, tempUserId: tempUser._id, message: "OTP sent" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;

    const pendingUser = await PendingUser.findById(tempUserId);
    if (!pendingUser) return res.status(400).json({ error: "Invalid user" });

    if (pendingUser.otp !== otp || new Date() > pendingUser.otpExpiresAt) {
      return res.status(400).json({ error: "OTP is invalid or expired" });
    }

    const { name, email, password, phone } = pendingUser;

    const newUser = await User.create({ name, email, password, phone });

    await pendingUser.deleteOne();

    try {
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // ✅ Only send one response here
      return res.status(200).json({
        success: true,
        message: "User verified",
        token
      });

    } catch (err) {
      await User.findByIdAndDelete(newUser._id); // optional cleanup
      return res.status(500).json({ error: "Token generation failed" });
    }

  } catch (err) {
    console.error("OTP verification error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt with email:", email);
    // 1. Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ error: "Invalid email or password" });
    

    // 2. Compare password
    console.log("password:", password);
    console.log("password from DB:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // 3. Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    // 4. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User does not exist" });

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await ForgotPaaswordPendingUser.findOneAndUpdate(
      { email },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    await sendEmail(email, otp,process.env.MAIL_USER, process.env.MAIL_PASS);

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await ForgotPaaswordPendingUser.findOne({ email });
    if (!record) return res.status(400).json({ error: "No OTP request found" });

    if (record.otp !== otp || new Date() > record.otpExpiresAt) {
      return res.status(400).json({ error: "OTP is invalid or expired" });
    }

    record.isVerified = true; // mark as verified
    await record.save();

    res.status(200).json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("OTP verify error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }

    
    const record = await ForgotPaaswordPendingUser.findOne({ email });

     if (!record || !record.isVerified) {
        return res.status(403).json({ error: "OTP not verified. Cannot reset password." });
     }


    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });



    user.password = newPassword;
    await user.save(); // hashes password if pre-save middleware exists

    await ForgotPaaswordPendingUser.deleteOne({ email }); // cleanup

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




export default { signup, verifyOtp ,login,forgotPassword,verifyForgotOtp,resetPassword};
