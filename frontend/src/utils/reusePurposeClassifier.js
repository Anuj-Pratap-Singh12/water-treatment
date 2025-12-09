/**
 * Classify reuse purposes based on final effluent quality (turbidity, BOD, total nitrogen)
 * Each purpose has specific limits; water meeting those limits is suitable for that purpose.
 */

export function classifyReusePurposes(turbidity, bod, tn) {
  const purposes = [
    {
      name: "Indirect Potable Reuse (Advanced)",
      limits: { turbidity: 1, bod: 3, tn: 5 },
      useCase: "Blending with raw water source"
    },
    {
      name: "Groundwater Recharge",
      limits: { turbidity: 5, bod: 5, tn: 10 },
      useCase: "Recharge wells, aquifers"
    },
    {
      name: "River / Surface Discharge",
      limits: { turbidity: 5, bod: 10, tn: 10 },
      useCase: "Discharge into rivers/lakes"
    },
    {
      name: "Industrial Process Water",
      limits: { turbidity: 5, bod: 10, tn: 10 },
      useCase: "Manufacturing, washing, cooling"
    },
    {
      name: "Cooling Tower Make-up",
      limits: { turbidity: 5, bod: 10, tn: 10 },
      useCase: "Power plants, HVAC systems"
    },
    {
      name: "Toilet Flushing",
      limits: { turbidity: 10, bod: 10, tn: 10 },
      useCase: "Residential & commercial toilets"
    },
    {
      name: "Gardening / Landscaping",
      limits: { turbidity: 10, bod: 10, tn: 10 },
      useCase: "Parks, lawns, plantations"
    },
    {
      name: "Firefighting Storage",
      limits: { turbidity: 10, bod: 20, tn: 15 },
      useCase: "Emergency fire water tanks"
    },
    {
      name: "Construction Use",
      limits: { turbidity: 10, bod: 20, tn: 15 },
      useCase: "Concrete mixing, curing"
    },
    {
      name: "Road Washing / Dust Control",
      limits: { turbidity: 10, bod: 20, tn: 15 },
      useCase: "Streets, highways, dust suppression"
    }
  ];

  const allowed = [];
  const notAllowed = [];

  purposes.forEach((purpose) => {
    const meetsLimits =
      turbidity <= purpose.limits.turbidity &&
      bod <= purpose.limits.bod &&
      tn <= purpose.limits.tn;

    if (meetsLimits) {
      allowed.push({
        name: purpose.name,
        useCase: purpose.useCase,
        limits: purpose.limits
      });
    } else {
      notAllowed.push({
        name: purpose.name,
        useCase: purpose.useCase,
        limits: purpose.limits,
        failures: {
          turbidity: turbidity > purpose.limits.turbidity ? turbidity : null,
          bod: bod > purpose.limits.bod ? bod : null,
          tn: tn > purpose.limits.tn ? tn : null
        }
      });
    }
  });

  return { allowed, notAllowed };
}
