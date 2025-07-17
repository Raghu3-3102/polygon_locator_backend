// models/Plan.model.js
import mongoose from "mongoose";

const ServiceChargeSlabSchema = new mongoose.Schema(
  {
    lowerThreshold: {
      type: Number,
      required: true,
    },
    upperThreshold: {
      type: Number,
      required: true,
    },
    serviceCharge: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const ServiceChargeSlab = mongoose.model("ServiceChargeSlab", ServiceChargeSlabSchema);

export default ServiceChargeSlab;
