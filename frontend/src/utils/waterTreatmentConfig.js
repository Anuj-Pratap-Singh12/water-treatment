// src/utils/waterTreatmentConfig.js

// High-level treatment & composition info for each water type.
// This is derived from your detailed notes for:
// Type 1: Potable, Type 2: Domestic, Type 3: Industrial,
// Type 4: Municipal/Sewage, Type 5: Heavily Polluted / Toxic.

export const WATER_TREATMENT_CONFIG = {
  TYPE_1: {
    label: "Type 1 — Drinking / Potable Water",
    composition: {
      pH: "6.5 – 8.5",
      TDS: "< 500 mg/L",
      Turbidity: "< 1 NTU",
      BOD: "< 2 mg/L",
      COD: "< 10 mg/L",
      TotalN: "< 1 mg/L",
      Temperature: "< 35°C",
    },
    train: {
      primary: [
        "Screening (coarse + fine)",
        "Sedimentation / Grit Removal",
        "Coagulation–Flocculation",
      ],
      secondary: [
        "Rapid Sand Filtration / Pressure Filtration",
      ],
      tertiary: [
        "Activated Carbon Filtration",
        "UV / Chlorination",
        "RO (if TDS slightly high)",
      ],
    },
    keyChemicals: [
      "Alum / PAC (for coagulation)",
      "Polyelectrolytes (low turbidity)",
      "Chlorine / Sodium Hypochlorite",
      "Activated Carbon (GAC/PAC)",
      "Lime / Soda Ash for pH correction",
    ],
  },

  TYPE_2: {
    label: "Type 2 — Domestic / General Use Water",
    composition: {
      pH: "6 – 9",
      TDS: "< 1500 mg/L",
      Turbidity: "< 5 NTU",
      BOD: "< 5 mg/L",
      COD: "< 20 mg/L",
      TotalN: "< 5 mg/L",
      Temperature: "< 40°C",
    },
    train: {
      primary: [
        "Screening",
        "Grit Removal (if river/groundwater)",
        "Coagulation–Flocculation",
        "Primary Sedimentation",
      ],
      secondary: [
        "Rapid Sand Filter / Dual Media Filter",
        "Optional Activated Carbon Filter",
      ],
      tertiary: [
        "Disinfection (Chlorine / UV)",
        "pH Correction (Lime / CO₂)",
        "Softening (Ion-exchange) if hard water",
      ],
    },
    keyChemicals: [
      "Alum / PAC",
      "Polymers (for flocs / sludge)",
      "Sodium Hypochlorite / Chlorine",
      "Lime, Soda Ash, CO₂",
      "Salt (for softener regeneration, if used)",
    ],
  },

  TYPE_3: {
    label: "Type 3 — Industrial Wastewater",
    composition: {
      TDS: "1500 – 5000 mg/L",
      Turbidity: "5 – 50 NTU",
      BOD: "5 – 30 mg/L (can be higher for some)",
      COD: "20 – 250 mg/L+",
      TotalN: "5 – 40 mg/L",
      Temperature: "40 – 60°C",
    },
    train: {
      primary: [
        "Screening (coarse + fine / drum screen)",
        "Equalization Tank with Mixing & Aeration",
        "pH Correction (acid / alkali)",
        "Coagulation–Flocculation",
        "Primary Clarifier / Lamella Clarifier",
      ],
      secondary: [
        "Biological Reactor (ASP / MBBR / SBR / MBR)",
        "Secondary Clarifier",
      ],
      tertiary: [
        "Advanced Oxidation (AOP: Ozone, UV + H₂O₂, Fenton)",
        "Activated Carbon Filter",
        "RO / NF (for TDS control)",
      ],
    },
    keyChemicals: [
      "Alum / PAC / Ferric Chloride (coagulation)",
      "Polymers (flocculation & sludge dewatering)",
      "Lime / NaOH / H₂SO₄ (pH adjustment)",
      "H₂O₂, Ozone, FeSO₄ (Fenton / AOP)",
      "Antiscalants (for RO)",
    ],
  },

  TYPE_4: {
    label: "Type 4 — Municipal / Sewage Wastewater",
    composition: {
      BOD: "> 30 mg/L",
      COD: "> 250 mg/L",
      Turbidity: "> 50 NTU",
      TDS: "> 500 mg/L",
      TotalN: "> 20 mg/L",
      Temperature: "30 – 45°C",
    },
    train: {
      primary: [
        "Screening (coarse + fine)",
        "Grit Chamber",
        "Primary Settling / Clarifier",
      ],
      secondary: [
        "Biological Treatment (ASP / Extended Aeration / SBR / MBBR / MBR)",
        "Secondary Clarifier (RAS / WAS handling)",
      ],
      tertiary: [
        "Filtration (Sand / Dual Media / ACF)",
        "Disinfection (Chlorine / UV / Ozone)",
        "Nutrient Removal (N & P) if required",
      ],
    },
    keyChemicals: [
      "Alum / Ferric Chloride (if coagulation used)",
      "Polymers (for clarifier & sludge)",
      "Chlorine / Sodium Hypochlorite / Ozone",
      "Lime / Acid (fine pH correction)",
    ],
  },

  TYPE_5: {
    label: "Type 5 — Heavily Polluted / Toxic Water (Red Alert)",
    composition: {
      BOD: "> 80 mg/L",
      COD: "> 400 mg/L",
      TDS: "> 5000 mg/L",
      Turbidity: "> 200 NTU",
      TotalN: "> 50 mg/L",
      Temperature: "> 60°C",
    },
    train: {
      primary: [
        "Screening, Grit & Oil Removal (DAF / API separator)",
        "Equalization Tank with Strong Mixing",
        "pH Neutralization (acid/alkali)",
        "High-dose Coagulation–Flocculation",
        "Primary Clarifier",
      ],
      secondary: [
        "High-Strength Biological Reactor (MBBR / SBR / MBR)",
        "Secondary Clarifier",
      ],
      tertiary: [
        "Advanced Oxidation (AOP, Fenton, Ozone, UV + H₂O₂)",
        "Activated Carbon Adsorption",
        "RO / Multi-stage RO",
        "Optional: ZLD (Zero Liquid Discharge)",
      ],
    },
    keyChemicals: [
      "High-dose Coagulants (PAC / Ferric Chloride)",
      "Polymers (for heavy sludge)",
      "Lime / Caustic / Acids (pH neutralization)",
      "H₂O₂, Ozone, FeSO₄ (AOP/Fenton)",
      "Antiscalants, Bisulfite (for RO/ZLD)",
    ],
  },
};
