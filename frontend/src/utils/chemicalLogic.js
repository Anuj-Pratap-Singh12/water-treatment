export function chemicalSelectionLogic(w) {
  const { pH, tds, turbidity, bod, cod, tn, heavyMetals } = w;

  const chemicals = [];

  // --- Coagulation / Flocculation ---
  if (turbidity > 100) chemicals.push({ chemical: "PAC", reason: "High turbidity > 100 NTU" });
  else if (turbidity > 20) chemicals.push({ chemical: "Alum", reason: "Moderate turbidity 20–100 NTU" });

  if (pH < 6) chemicals.push({ chemical: "PAC", reason: "Low pH (<6) – alum becomes ineffective" });

  if (tds > 500) chemicals.push({ chemical: "Ferric Chloride", reason: "High TDS – ferric works better in saline water" });

  if (turbidity < 10) chemicals.push({ chemical: "Polymer", reason: "Very low turbidity requires polymer bridging" });

  // --- Heavy Metals ---
  if (heavyMetals) chemicals.push({
    chemical: "Lime + Sulfide Precipitation",
    reason: "Heavy metals present → precipitation required"
  });

  // --- Biological Treatment Nutrients ---
  if (bod > 30 && tn < 10) chemicals.push({
    chemical: "Urea",
    reason: "Low nitrogen for biological growth"
  });

  if (bod > 30 && tn < 3) chemicals.push({
    chemical: "DAP",
    reason: "Low phosphorus for biological treatment"
  });

  // --- Disinfection ---
  if (turbidity < 1) chemicals.push({
    chemical: "UV",
    reason: "Very clear water suitable for UV disinfection"
  });
  else chemicals.push({
    chemical: "Chlorine",
    reason: "Turbidity > 1 NTU → UV not reliable"
  });

  return chemicals;
}
