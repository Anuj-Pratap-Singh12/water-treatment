// routes/dashboard.js
const express = require("express");
const SensorReading = require("../models/SensorReading");
const Alert = require("../models/Alert");

const router = express.Router();

router.get("/summary", async (_req, res) => {
  try {
    const [totalReadings, totalAlerts, criticalAlerts] = await Promise.all([
      SensorReading.countDocuments(),
      Alert.countDocuments(),
      Alert.countDocuments({ severity: "critical" })
    ]);

    const latestAlert = await Alert.findOne().sort({ createdAt: -1 }).populate("location");

    res.json({
      totalReadings,
      totalAlerts,
      criticalAlerts,
      latestAlert
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
