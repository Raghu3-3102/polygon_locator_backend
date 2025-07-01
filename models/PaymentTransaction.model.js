import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema({
  name: { type: String, required: true },               // From form
  email: { type: String, required: true },              // From form
  phoneNumber: { type: String, required: true },        // From form
  dob: { type: String },                                // From form (date picker)
  serviceNeeded: { type: String, required: true },      // Dropdown
  address: { type: String },                            // From form
  // Optional textarea

  // Payment-related fields
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Zone" },
  amount: Number,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("PaymentTransaction", paymentTransactionSchema);
