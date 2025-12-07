// models/SensorReading.js
const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },
    // Water quality parameters (you can adjust as needed)
    ph: Number,
    turbidity: Number,        // NTU
    tds: Number,              // ppm
    temperature: Number,      // °C
    ecoliCount: Number,       // CFU/100ml (or 0/1 if just presence/absence)
    sourceType: {
      type: String,
      enum: ["groundwater", "surface", "tap", "tank", "other"],
      default: "other"
    },
    // Recovery system metrics (optional – for AquaRevive)
    tankLevel: Number,        // %
    recoveryUnitStatus: {
      type: String,
      enum: ["online", "offline", "maintenance"],
      default: "online"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SensorReading", sensorReadingSchema);
