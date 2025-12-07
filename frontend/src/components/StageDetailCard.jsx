// src/components/StageDetailCard.jsx
import React from "react";

/**
 * StageDetailCard
 * props:
 *  - stageKey: string|null
 */
const stageData = {
  primary: {
    title: "Primary Treatment",
    subtitle: "Removes settleable solids & grit",
    performance: "50–70% TSS; 20–35% BOD",
    desc: "Primary treatment removes settleable solids, grit and large particulate matter through screening and sedimentation.",
    tech: ["Screens & Grit", "Primary Clarifier", "Chemically Enhanced Primary (optional)"],
  },
  secondary: {
    title: "Secondary Treatment",
    subtitle: "Biological organic removal",
    performance: "80–95% BOD; 50–70% TSS",
    desc: "Secondary treatment uses biological processes (aerobic/anaerobic) to remove dissolved and colloidal organics.",
    tech: ["Activated Sludge", "MBBR", "SBR", "Aeration & Clarification"],
  },
  tertiary: {
    title: "Tertiary Treatment",
    subtitle: "Nutrient & advanced contaminant removal",
    performance: "≥90% TN/TP removal (with advanced processes)",
    desc: "Tertiary removes nutrients, fine solids and trace contaminants using filtration, adsorption and disinfection.",
    tech: ["Sand/Cartridge Filters", "Membranes (UF/NF/RO)", "Ion Exchange", "UV / Chlorination / Ozone"],
  },
  storage: {
    title: "Storage & Reuse",
    subtitle: "Polished water buffer & distribution",
    performance: "Ensures steady supply & contact time for disinfection",
    desc: "Storage provides buffer capacity and final polishing prior to distribution for reuse.",
    tech: ["Holding Tanks", "Polishing Filters", "Re-pressurization & Distribution"],
  }
};

export default function StageDetailCard({ stageKey }) {
  if (!stageKey) {
    return (
      <div className="glass-card p-6 rounded-xl min-h-[160px]">
        <div className="text-muted">Tip: click any stage in the diagram to view details.</div>
      </div>
    );
  }

  const s = stageData[stageKey];
  return (
    <div className="glass-card p-6 rounded-xl transition-transform duration-400">
      <div className="flex items-start gap-4">
        <div className="w-3 h-12 rounded bg-gradient-to-b from-sky-400 to-teal-300" />
        <div>
          <h3 className="text-xl font-bold">{s.title}</h3>
          <div className="text-sm text-muted mt-1">{s.subtitle}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted">Performance</div>
          <div className="font-semibold mt-1">{s.performance}</div>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{s.desc}</p>
        </div>

        <div>
          <div className="text-sm text-muted">Common Technologies</div>
          <ul className="mt-2 space-y-2">
            {s.tech.map((t) => (
              <li key={t} className="p-2 rounded-md bg-white/60 dark:bg-slate-800/60 border">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
