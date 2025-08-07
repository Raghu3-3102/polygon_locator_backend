import mongoose from "mongoose";


const IspUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dob: { type: Date },

  serviceNeeded: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  nation: { type: String },
  zipCode: { type: String },

  amount: { type: Number, required: true },
  duration: { type: String },
  planId: { type: String },
  PlanName: { type: String },
  serviceCharge: { type: Number },

  accountId: { type: String },
  userName: { type: String },
  userGroupId: { type: Number },

  payMentStatus: { type: String, default: "Pending" },

}, { timestamps: true });

export default mongoose.model("ISP_USER", IspUserSchema);
