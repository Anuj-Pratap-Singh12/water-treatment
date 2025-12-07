// backend/routes/mlRoutes.js
const express = require("express");
const { getMlRecommendation } = require("../controllers/mlController");

const router = express.Router();

// POST /api/ml/recommend
router.post("/recommend", getMlRecommendation);

module.exports = router; // 👈 IMPORTANT: export the router itself
