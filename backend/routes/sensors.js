// routes/sensors.js
const express = require("express");
const SensorReading = require("../models/SensorReading");
const Alert = require("../models/Alert");
const Location = require("../models/Location");
const evaluateAlert = require("./utils/evaluateAlert");

const router = express.Router();

/**
 * POST /api/sensors
 * Body: {
 *   locationId,
 *   ph, turbidity, tds, temperature, ecoliCount,
 *   sourceType, tankLevel, recoveryUnitStatus
 * }
 */
router.post("/", async (req, res) => {
  try {
    const {
      locationId,
      ph,
      turbidity,
      tds,
      temperature,
      ecoliCount,
      sourceType,
      tankLevel,
      recoveryUnitStatus
    } = req.body;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    const reading = await SensorReading.create({
      location: locationId,
      ph,
      turbidity,
      tds,
      temperature,
      ecoliCount,
      sourceType,
      tankLevel,
      recoveryUnitStatus
    });

    // Evaluate thresholds and auto-create alert if needed
    const alertInfo = evaluateAlert({ ph, turbidity, tds, ecoliCount });
    let alert = null;

    if (alertInfo) {
      alert = await Alert.create({
        location: locationId,
        severity: alertInfo.severity,
        type: alertInfo.type,
        message: alertInfo.message
      });
    }

    res.status(201).json({
      reading,
      alertGenerated: !!alert,
      alert
    });
  } catch (err) {
    console.error("Create sensor reading error:", err);
    res.status(500).json({ error: "Failed to save sensor data" });
  }
});

// Get latest readings for all locations (for dashboard)
router.get("/latest", async (_req, res) => {
  try {
    const readings = await SensorReading.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$location",
          latestReading: { $first: "$$ROOT" }
        }
      }
    ]);

    const populated = await SensorReading.populate(readings, {
      path: "latestReading.location",
      model: "Location"
    });

    res.json(populated.map(r => r.latestReading));
  } catch (err) {
    console.error("Get latest readings error:", err);
    res.status(500).json({ error: "Failed to fetch latest sensor data" });
  }
});

// Get readings for one location (for charts)
router.get("/location/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const readings = await SensorReading.find({ location: id })
      .sort({ createdAt: -1 })
      .limit(100); // last 100 records
    res.json(readings);
  } catch (err) {
    console.error("Get location readings error:", err);
    res.status(500).json({ error: "Failed to fetch sensor data" });
  }
});

module.exports = router;
