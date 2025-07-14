import mongoose from "mongoose";

const UserOutOfTheLocation = new mongoose.Schema({
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

   // ✅ Add this field for API response
  externalFunnelResponse: {
    type: Object,
    default: null
  }

});

export default mongoose.model("UserOutOfTheLocation",UserOutOfTheLocation);

 