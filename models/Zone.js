// backend/models/Zone.js
import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
  zone: { type: String, required: true },
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
