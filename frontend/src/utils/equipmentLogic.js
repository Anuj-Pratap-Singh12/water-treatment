export function equipmentSelectionLogic(w) {
  const { tds, turbidity, bod, cod, temperature, heavyMetals } = w;

  const equipment = {
    primary: [],
    secondary: [],
    tertiary: [],
  };

  // --- Primary ---
  if (turbidity > 100)
    equipment.primary.push("Bar Screen + Fine Mechanical Screen");
  else equipment.primary.push("Coarse Screen");

  if (heavyMetals)
    equipment.primary.push("Chemical Precipitation Unit");

  if (cod > 300)
    equipment.primary.push("Coagulation + Flocculation with Flash Mixer");

  // --- Secondary ---
  if (bod > 80 || cod > 400)
    equipment.secondary.push("High-Strength Biological Reactor (MBR/SBR)");

  if (bod > 30)
    equipment.secondary.push("Aeration Tank + Blowers");

  // --- Tertiary ---
  if (tds > 5000) equipment.tertiary.push("RO (Reverse Osmosis)");
  else if (tds > 1500) equipment.tertiary.push("Nano-filtration");

  if (cod > 250)
    equipment.tertiary.push("Advanced Oxidation (UV + H2O2 / Ozone)");

  equipment.tertiary.push("Activated Carbon Filter");

  return equipment;
}
