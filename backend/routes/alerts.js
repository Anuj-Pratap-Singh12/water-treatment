// routes/alerts.js
const express = require("express");
const Alert = require("../models/Alert");

const router = express.Router();

// Get recent alerts
router.get("/", async (_req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("location")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(alerts);
  } catch (err) {
    console.error("Get alerts error:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// Acknowledge an alert
router.patch("/:id/ack", async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findByIdAndUpdate(
      id,
      { acknowledged: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    console.error("Acknowledge alert error:", err);
    res.status(500).json({ error: "Failed to update alert" });
  }
});

module.exports = router;
