import mongoose from "mongoose";

// Plan Schema
const planSchema = new mongoose.Schema({
  SrNo: Number,
  PlanName: String,
  Duration: String,
  MRP: Number,
  PrimaryUploadSpeedMbps: Number,
  PrimaryDownloadSpeedMbps: Number,
   planType: String   
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan;

// Your API Response
