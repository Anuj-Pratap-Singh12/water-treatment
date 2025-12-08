// src/utils/waterClassification.js

// Definition + standard treatment train for each type
export const WATER_TYPE_DEFS = {
  TYPE_1: {
    id: 1,
    code: "TYPE_1",
    label: "Type 1 – Drinking / Potable Water",
    severity: "very_low",
    badgeColor: "emerald",
    description:
      "High-quality water suitable for drinking after polishing and disinfection.",
    primary: [
      "Screening",
      "Sedimentation",
      "Coagulation–Flocculation",
    ],
    secondary: [
      "Rapid Sand Filtration",
      "Pressure Filtration",
    ],
    tertiary: [
      "Activated Carbon Filtration",
      "UV / Chlorination",
      "Reverse Osmosis (if TDS slightly high)",
    ],
  },
  TYPE_2: {
    id: 2,
    code: "TYPE_2",
    label: "Type 2 – Domestic / General Use Water",
    severity: "low",
    badgeColor: "sky",
    description:
      "Water suitable for washing, bathing and household use but not for direct drinking.",
    primary: [
      "Screening",
      "Sedimentation / Grit Removal",
      "Coagulation–Flocculation",
    ],
    secondary: [
      "Biological Filtration / Trickling Filter",
      "Aeration + Basic Activated Sludge",
    ],
    tertiary: [
      "Fine Filtration",
      "Disinfection (UV or Chlorine)",
    ],
  },
  TYPE_3: {
    id: 3,
    code: "TYPE_3",
    label: "Type 3 – Industrial Wastewater",
    severity: "medium",
    badgeColor: "amber",
    description:
      "Industrial effluent with moderate to high TDS / organics that requires structured treatment.",
    primary: [
      "Equalization Tank",
      "Oil & Grease Trap",
      "Coagulation–Flocculation",
      "Primary Clarifier",
    ],
    secondary: [
      "Activated Sludge Process",
      "Aeration Tank",
      "MBBR / SBR Reactor",
    ],
    tertiary: [
      "Advanced Oxidation (AOP: Ozone, UV + H₂O₂)",
      "Activated Carbon Filter",
      "RO / Nano-filtration (if high TDS)",
    ],
  },
  TYPE_4: {
    id: 4,
    code: "TYPE_4",
    label: "Type 4 – Municipal / Sewage Wastewater",
    severity: "high",
    badgeColor: "orange",
    description:
      "Untreated or partially treated urban sewage with high BOD, COD and suspended solids.",
    primary: [
      "Screening",
      "Grit Chamber",
      "Primary Settling",
    ],
    secondary: [
      "Activated Sludge",
      "Trickling Filter / Oxidation Ponds",
      "MBBR",
    ],
    tertiary: [
      "Sand + Carbon Filtration",
      "Chlorination / UV",
      "Nutrient Removal (N & P)",
    ],
  },
  TYPE_5: {
    id: 5,
    code: "TYPE_5",
    label: "Type 5 – Heavily Polluted / Toxic Water",
    severity: "very_high",
    badgeColor: "rose",
    description:
      "Red alert category: heavily contaminated water that needs advanced and often multi-stage treatment.",
    primary: [
      "Chemical Precipitation (heavy metals)",
      "Oil / Grease Separation",
      "Neutralization Tank",
      "High-dose Coagulation–Flocculation",
    ],
    secondary: [
      "High-strength Biological Reactor",
      "MBR (Membrane Bioreactor)",
      "SBR (Sequencing Batch Reactor)",
    ],
    tertiary: [
      "RO / Multi-stage RO",
      "Advanced Oxidation (AOP)",
      "Activated Carbon Adsorption",
      "Ion Exchange",
      "Zero Liquid Discharge (ZLD) – optional",
    ],
  },
};

// Helper checks

function isType1(q) {
  return (
    q.pH >= 6.5 &&
    q.pH <= 8.5 &&
    q.tds < 500 &&
    q.turbidity < 1 &&
    q.bod < 2 &&
    q.cod < 10 &&
    q.tn < 1 &&
    q.temperature < 35
  );
}

function isType2(q) {
  return (
    q.pH >= 6 &&
    q.pH <= 9 &&
    q.tds < 1500 &&
    q.turbidity < 5 &&
    q.bod < 5 &&
    q.cod < 20 &&
    q.tn < 5 &&
    q.temperature < 40
  );
}

function isType5(q) {
  // Red alert: any extreme parameter
  return (
    q.bod > 80 ||
    q.cod > 400 ||
    q.tds > 5000 ||
    q.turbidity > 200 ||
    q.temperature > 60 ||
    q.tn > 50
  );
}

function isType4(q) {
  // High organic sewage-like: count how many are "high"
  let score = 0;
  if (q.bod > 30) score++;
  if (q.cod > 250) score++;
  if (q.turbidity > 50) score++;
  if (q.tds > 500) score++;
  if (q.tn > 20) score++;
  if (q.temperature >= 30 && q.temperature <= 45) score++;
  return score >= 3;
}

function isType3(q) {
  // Industrial – any 3+ moderately elevated in given ranges
  let score = 0;
  if (q.tds >= 1500 && q.tds <= 5000) score++;
  if (q.turbidity >= 5 && q.turbidity <= 50) score++;
  if (q.bod >= 5 && q.bod <= 30) score++;
  if (q.cod >= 20 && q.cod <= 250) score++;
  if (q.tn >= 5 && q.tn <= 40) score++;
  if (q.temperature >= 40 && q.temperature <= 60) score++;
  return score >= 3;
}

/**
 * classifyWaterType
 * @param {{pH:number, tds:number, turbidity:number, bod:number, cod:number, tn:number, temperature:number}} q
 * @returns {{id:number, code:string, label:string, description:string, severity:string, primary:string[], secondary:string[], tertiary:string[]} | null}
 */
export function classifyWaterType(q) {
  // Priority: Type 5 (worst) → 4 → 3 → 1 → 2
  if (isType5(q)) return WATER_TYPE_DEFS.TYPE_5;
  if (isType4(q)) return WATER_TYPE_DEFS.TYPE_4;
  if (isType3(q)) return WATER_TYPE_DEFS.TYPE_3;
  if (isType1(q)) return WATER_TYPE_DEFS.TYPE_1;
  if (isType2(q)) return WATER_TYPE_DEFS.TYPE_2;
  return null; // Unclassified / borderline
}
