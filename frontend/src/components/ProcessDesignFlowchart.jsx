// src/components/ProcessDesignFlowchart.jsx
import React from "react";

const steps = {
  TYPE_1: [
    "Screening",
    "Coagulation & Flocculation",
    "Sedimentation",
    "Filtration (Sand/Carbon)",
    "Activated Carbon Polishing",
    "Disinfection (UV/Chlorination)",
  ],
  TYPE_2: [
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
  TYPE_3: [
    "Screening",
    "Grit Chamber",
    "Equalization",
    "Biological Reactor",
    "Membrane Bioreactor (MBR)",
    "Activated Carbon Filter",
    "Disinfection",
  ],
  TYPE_4: [
    "Screening",
    "Neutralization Tank",
    "Chemical Precipitation",
    "Heavy Metal Removal",
    "Filter Press",
    "Carbon Filter",
    "RO Treatment",
  ],
  TYPE_5: [
    "Screening",
    "Anaerobic Reactor",
    "Biogas Handling",
    "Aeration Tank",
    "Secondary Clarifier",
    "Sludge Handling",
    "Tertiary Filtration",
  ],
};

function Flow({ title, subtitle, list, accent = "emerald" }) {
  const accentBg =
    accent === "emerald"
      ? "bg-emerald-50"
      : accent === "sky"
      ? "bg-sky-50"
      : accent === "amber"
      ? "bg-amber-50"
      : accent === "rose"
      ? "bg-rose-50"
      : "bg-slate-50";

  const accentBorder =
    accent === "emerald"
      ? "border-emerald-200"
      : accent === "sky"
      ? "border-sky-200"
      : accent === "amber"
      ? "border-amber-200"
      : accent === "rose"
      ? "border-rose-200"
      : "border-slate-200";

  const accentChip =
    accent === "emerald"
      ? "bg-emerald-100 text-emerald-800"
      : accent === "sky"
      ? "bg-sky-100 text-sky-800"
      : accent === "amber"
      ? "bg-amber-100 text-amber-800"
      : accent === "rose"
      ? "bg-rose-100 text-rose-800"
      : "bg-slate-100 text-slate-800";

  const accentLine =
    accent === "emerald"
      ? "bg-emerald-100"
      : accent === "sky"
      ? "bg-sky-100"
      : accent === "amber"
      ? "bg-amber-100"
      : accent === "rose"
      ? "bg-rose-100"
      : "bg-slate-200";

  const accentDot =
    accent === "emerald"
      ? "border-emerald-500"
      : accent === "sky"
      ? "border-sky-500"
      : accent === "amber"
      ? "border-amber-500"
      : accent === "rose"
      ? "border-rose-500"
      : "border-slate-500";

  return (
    <div
      className={`group relative p-4 w-full rounded-2xl border ${accentBorder} ${accentBg} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
    >
      {/* subtle gradient highlight */}
      <div className="pointer-events-none absolute inset-x-3 top-0 h-10 rounded-b-full bg-white/40 blur-2 opacity-70" />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${accentChip}`}
        >
          Flowchart
        </span>
      </div>

      {/* Timeline */}
      <div className="relative mt-2 pl-6">
        {/* vertical line */}
        <div
          className={`absolute left-[7px] top-2 bottom-3 w-px ${accentLine}`}
        />

        <div className="space-y-2.5">
          {list.map((step, index) => (
            <div key={index} className="relative flex items-start gap-2">
              {/* node */}
              <div className="relative">
                <div
                  className={`h-3.5 w-3.5 rounded-full bg-white border-2 ${accentDot} shadow-[0_0_0_3px_rgba(255,255,255,0.9)]`}
                />
                <span className="absolute -left-0.5 top-3 text-[9px] text-slate-400 select-none">
                  {index + 1}
                </span>
              </div>

              {/* step card */}
              <div className="flex-1">
                <div className="rounded-xl bg-white/90 border border-slate-100 px-3 py-1.5 text-[11px] text-slate-800 shadow-[0_1px_0_rgba(15,23,42,0.06)] group-hover:border-slate-200">
                  {step}
                </div>
                {index < list.length - 1 && (
                  <div className="pl-1.5 pt-0.5 text-[9px] uppercase tracking-wide text-slate-400">
                    Next
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProcessDesignFlowchart() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <Flow
        title="Type 1 – Drinking / Potable Water"
        subtitle="High-quality polishing & disinfection"
        list={steps.TYPE_1}
        accent="emerald"
      />
      <Flow
        title="Type 2 – Domestic / Grey Water"
        subtitle="Typical STP train for reuse"
        list={steps.TYPE_2}
        accent="sky"
      />
      <Flow
        title="Type 3 – Treated Wastewater (Recycle Grade)"
        subtitle="MBR-centric advanced treatment"
        list={steps.TYPE_3}
        accent="amber"
      />
      <Flow
        title="Type 4 – Industrial Effluent"
        subtitle="High TDS / heavy metal focus"
        list={steps.TYPE_4}
        accent="rose"
      />
      <Flow
        title="Type 5 – High Organic Load Wastewater"
        subtitle="Anaerobic + aerobic combo"
        list={steps.TYPE_5}
        accent="emerald"
      />
    </div>
  );
}
