// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, minlength: 6, select: false },
  role: { type: String, enum: ["user", "admin", "employee"], default: "admin" },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
