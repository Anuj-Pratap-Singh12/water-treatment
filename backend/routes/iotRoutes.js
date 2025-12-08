// backend/routes/iotRoutes.js
const express = require("express");
const { getGptWaterData } = require("../controllers/gptWaterController");

const router = express.Router();

/**
 * GET /api/iot/water
 * Generates realistic wastewater sensor data using GPT
 * Returns water quality parameters that can be used in the treatment simulator
 */
router.get("/water", getGptWaterData);

module.exports = router;
