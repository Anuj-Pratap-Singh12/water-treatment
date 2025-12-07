// models/Alert.js
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true
    },
    type: {
      type: String,
      enum: ["water_quality", "system_failure", "health_risk"],
      default: "water_quality"
    },
    message: { type: String, required: true },
    acknowledged: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
