import mongoose from "mongoose";


const RazorpayAdminSchema = new mongoose.Schema({
  razorPayID: { type: String, required: true },
  razorPaySecret: { type: String, required: true },
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true }
}, { timestamps: true });


export default mongoose.model("RazorpayAdmin", RazorpayAdminSchema);