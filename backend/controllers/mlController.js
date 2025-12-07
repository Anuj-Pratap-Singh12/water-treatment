// backend/controllers/mlController.js
const fetch = require("node-fetch");

// Map recipe_class -> human-readable treatment process
const RECIPE_MAP = {
  recipe_1: {
    label: "Low-load, basic tertiary",
    description:
      "Primary: Sedimentation; Secondary: Activated Sludge (ASP); Tertiary: Sand + Activated Carbon Filter",
    stages: {
      primary: ["Screening", "Grit Chamber", "Sedimentation"],
      secondary: ["Aeration Tank", "Secondary Clarifier (ASP)"],
      tertiary: ["Sand Filter", "Activated Carbon Filter"],
    },
  },
  recipe_2: {
    label: "Medium-load, advanced bio + UV",
    description:
      "Primary: Alum-aided Sedimentation; Secondary: MBBR; Tertiary: Sand + ACF + UV disinfection",
    stages: {
      primary: ["Screening", "Grit Chamber", "Alum + Sedimentation"],
      secondary: ["MBBR Reactor", "Secondary Clarifier"],
      tertiary: ["Sand Filter", "Activated Carbon Filter", "UV Disinfection"],
    },
  },
  recipe_3: {
    label: "High-load, full advanced (RO + UV)",
    description:
      "Primary: Alum-aided Sedimentation; Secondary: SBR; Tertiary: RO + UV + Chlorine",
    stages: {
      primary: ["Screening", "Grit Chamber", "Alum + Sedimentation"],
      secondary: ["Equalization Tank", "SBR Reactor", "Secondary Clarifier"],
      tertiary: ["Sand Filter", "Activated Carbon Filter", "RO", "UV", "Chlorination"],
    },
  },
  recipe_4: {
    label: "Medium-high TDS with RO",
    description:
      "Primary: Sedimentation; Secondary: ASP; Tertiary: RO + UV",
    stages: {
      primary: ["Screening", "Grit Chamber", "Sedimentation"],
      secondary: ["Aeration Tank", "Secondary Clarifier (ASP)"],
      tertiary: ["Sand Filter", "RO", "UV Disinfection"],
    },
  },
};

async function getMlRecommendation(req, res) {
  try {
    const { quality, intendedReuse } = req.body;

    if (!quality) {
      return res.status(400).json({ message: "Missing 'quality' field in body" });
    }

    const payload = {
      pH: quality.pH,
      tds: quality.tds,
      turbidity: quality.turbidity,
      bod: quality.bod,
      cod: quality.cod,
      temperature: quality.temperature,
      heavy_metals: quality.heavyMetals ? !!quality.heavyMetals.present : false,
      intended_reuse: intendedReuse || "Irrigation",
    };

    const mlRes = await fetch("http://localhost:8001/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!mlRes.ok) {
      console.error("ML service status:", mlRes.status);
      return res.status(500).json({ message: "ML service error" });
    }

    const mlData = await mlRes.json();

    const recipeKey = mlData.recipe_class;
    const recipeMeta = RECIPE_MAP[recipeKey] || {
      label: "Unknown recipe",
      description: "No description available for this class.",
      stages: {},
    };

    const response = {
      recipeClass: recipeKey,
      recipeLabel: recipeMeta.label,
      recipeDescription: recipeMeta.description,
      stages: recipeMeta.stages,
      chemicalDoses: mlData.chemical_doses,
      intendedReuse: intendedReuse || null,
    };

    return res.json(response);
  } catch (err) {
    console.error("ML recommendation error:", err);
    return res.status(500).json({ message: "ML prediction failed" });
  }
}

module.exports = { getMlRecommendation };
