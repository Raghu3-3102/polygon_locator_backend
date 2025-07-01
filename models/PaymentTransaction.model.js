// models/PaymentTransaction.js
import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Zone" },
  amount: Number,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PaymentTransaction", paymentTransactionSchema);
