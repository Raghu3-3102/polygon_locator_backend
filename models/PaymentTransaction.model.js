import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema({
  // 🧑 User Info
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dob: { type: String },
  serviceNeeded: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  nation: { type: String },
  zipCode: { type: String },

  // 📝 Plan Details (Grouped)
  planDetails: {
    planName: { type: String, required: true },         // "AIRWIRE_SILVER@6M"
    duration: { type: String },                         // "210 Day"
    mrp: { type: Number },                              // 4949.00
    primaryUploadSpeedMbps: { type: Number },           // 100
    primaryDownloadSpeedMbps: { type: Number },         // 100
  },

  // 💳 Razorpay Core Info
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  // ✅ Razorpay Complete Fields
  razorpayId: String,
  amount: Number,
  currency: String,
  status: String,
  order_id: String,
  invoice_id: String,
  method: String,
  amount_refunded: Number,
  amount_transferred: Number,
  refund_status: String,
  captured: Boolean,
  description: String,
  card_id: String,
  card: mongoose.Schema.Types.Mixed,
  bank: String,
  wallet: String,
  vpa: String,
  contact: String,
  notes: mongoose.Schema.Types.Mixed,
  fee: Number,
  tax: Number,
  error_code: String,
  error_description: String,
  created_at: Number,
  card_type: String,
  card_network: String,
  Auth_code: String,
  Payments_ARN: String,
  Payments_RRN: String,
  flow: String,

  // 🔁 Status
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },

  // 🕒 Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("PaymentTransaction", paymentTransactionSchema);
