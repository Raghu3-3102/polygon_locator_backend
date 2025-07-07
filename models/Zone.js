// backend/models/Zone.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    "SrNo": Number,
    "Plan Name": String,
    "Duration": String,
    "MRP": Number,
    "Primary Upload Speed (Mbps)": Number,
    "Primary Download Speed (Mbps)": Number,
  },
  { _id: false }
);

const zoneSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  properties: [planSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Polygon", "MultiPolygon"],
      required: true,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
});

zoneSchema.index({ geometry: "2dsphere" });

export default mongoose.model("Zone", zoneSchema);
