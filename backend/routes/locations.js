// routes/locations.js
const express = require("express");
const Location = require("../models/Location");

const router = express.Router();

// Create location
router.post("/", async (req, res) => {
  try {
    const { name, region, latitude, longitude } = req.body;
    const location = await Location.create({ name, region, latitude, longitude });
    res.status(201).json(location);
  } catch (err) {
    console.error("Create location error:", err);
    res.status(500).json({ error: "Failed to create location" });
  }
});

// Get all locations
router.get("/", async (_req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    console.error("Get locations error:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

module.exports = router;
