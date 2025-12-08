// src/components/ProcessFlowDiagram.jsx
import React from "react";

const ProcessFlowDiagram = ({ waterType = null }) => {
  const waterTypes = [
    {
      id: 1,
      name: "Type 1 – Drinking / Potable Water",
      subtitle: "High-quality polishing & disinfection",
      color: "from-blue-500 to-cyan-500",
      steps: [
        "Screening",
        "Coagulation & Flocculation",
        "Sedimentation",
        "Filtration (Sand/Carbon)",
        "Activated Carbon Polishing",
        "Disinfection (UV/Chlorination)",
      ],
    },
    {
      id: 2,
      name: "Type 2 – Domestic / Grey Water",
      subtitle: "Typical STP train for reuse",
      color: "from-green-500 to-emerald-500",
      steps: [
        "Screening",
        "Oil & Grease Removal",
        "Equalization Tank",
        "Coagulation–Flocculation",
        "Primary Clarification",
        "Aeration (Biological Treatment)",
        "Secondary Clarifier",
        "Filtration",
        "Disinfection",
      ],
    },
    {
      id: 3,
      name: "Type 3 – Treated Wastewater (Recycle Grade)",
      subtitle: "MBR-centric advanced treatment",
      color: "from-amber-500 to-orange-500",
      steps: [
        "Screening",
        "Grit Chamber",
        "Equalization",
        "Biological Reactor",
        "Membrane Bioreactor (MBR)",
        "Activated Carbon Filter",
        "Disinfection",
      ],
    },
    {
      id: 4,
      name: "Type 4 – Industrial Effluent",
      subtitle: "High TDS / heavy metal focus",
      color: "from-rose-500 to-pink-500",
      steps: [
        "Screening",
        "Neutralization Tank",
        "Chemical Precipitation",
        "Heavy Metal Removal",
        "Filter Press",
        "Carbon Filter",
        "RO Treatment",
      ],
    },
    {
      id: 5,
      name: "Type 5 – High Organic Load Wastewater",
      subtitle: "Anaerobic + aerobic combo",
      color: "from-violet-500 to-purple-500",
      steps: [
        "Screening",
        "Anaerobic Reactor",
        "Biogas Handling",
        "Aeration Tank",
        "Secondary Clarifier",
        "Sludge Handling",
        "Tertiary Filtration",
      ],
    },
  ];

  // Determine which water types to show
  const getDisplayedWaterTypes = () => {
    if (!waterType || !waterType.id) {
      return waterTypes;
    }
    // Extract the type number from waterType (e.g., "TYPE_1" -> 1)
    const typeMatch = String(waterType.id || waterType.label).match(/(\d+)/);
    const typeNum = typeMatch ? parseInt(typeMatch[1]) : null;
    
    if (typeNum && typeNum >= 1 && typeNum <= 5) {
      return waterTypes.filter((wt) => wt.id === typeNum);
    }
    return waterTypes;
  };

  const displayedTypes = getDisplayedWaterTypes();
  const showingAllTypes = displayedTypes.length === waterTypes.length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Process Flow Diagram {!showingAllTypes ? `(${displayedTypes[0].name})` : "(All Water Types)"}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {showingAllTypes
              ? "Review each treatment train to understand the process flow for your water type."
              : `Based on your influent quality, the recommended treatment train is: ${displayedTypes[0].name}`}
          </p>
        </div>
      </div>

      {/* PID Cards for each water type */}
      <div className="grid grid-cols-1 gap-5">
        {displayedTypes.map((wt) => (
          <div
            key={wt.id}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
          >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${wt.color} p-5 text-white`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold">{wt.name}</div>
                  <div className="text-xs text-white/80 mt-1">{wt.subtitle}</div>
                </div>
                <div className="text-lg font-bold opacity-50">{wt.id}</div>
              </div>
            </div>

            {/* Process steps */}
            <div className="p-5">
              <div className="text-xs font-semibold text-slate-600 uppercase mb-4">
                Treatment Sequence
              </div>

              {/* Horizontal flow diagram */}
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-4">
                {wt.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 whitespace-nowrap flex-shrink-0 hover:bg-slate-200 transition-colors">
                      {step}
                    </div>
                    {idx < wt.steps.length - 1 && (
                      <div className="text-slate-400 font-bold flex-shrink-0">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Vertical detailed list (for mobile/reference) */}
              {/* <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="text-[11px] font-semibold text-slate-500 uppercase mb-2">
                  Process Steps
                </div>
                <ol className="space-y-2">
                  {wt.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-2 text-[11px]">
                      <span className="font-bold text-slate-500 min-w-[1.5rem]">
                        {idx + 1}.
                      </span>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Legend / Notes */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-sm p-5">
        <div className="text-xs font-semibold text-slate-600 uppercase mb-3">
          {showingAllTypes ? "Key Design Principles" : "Treatment Details"}
        </div>
        <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
          {showingAllTypes ? (
            <>
              <li><span className="font-semibold">Type 1:</span> Focuses on polishing & disinfection for potable use</li>
              <li><span className="font-semibold">Type 2:</span> Biological treatment for domestic grey water reuse</li>
              <li><span className="font-semibold">Type 3:</span> Advanced MBR technology for recycled water</li>
              <li><span className="font-semibold">Type 4:</span> Chemical & heavy metal removal for industrial streams</li>
              <li><span className="font-semibold">Type 5:</span> Anaerobic digestion + biogas recovery for high-organic loads</li>
            </>
          ) : (
            <>
              <li>This treatment train is selected based on your influent quality classification.</li>
              <li>Each process step is optimized for the contaminants present in your water type.</li>
              <li>Review equipment and chemical recommendations in the detailed treatment report.</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProcessFlowDiagram;