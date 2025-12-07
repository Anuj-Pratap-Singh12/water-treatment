// models/Location.js
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // e.g. Village name / community
    region: { type: String, required: true },        // e.g. "Assam, India"
    latitude: Number,
    longitude: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
