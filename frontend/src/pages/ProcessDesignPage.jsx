// src/pages/ProcessDesignPage.jsx
import React from "react";
import ProcessFlow from "../components/ProcessFlow";
import StageDetailCard from "../components/StageDetailCard";
import TreatmentSimulator from "../components/TreatmentSimulator";

export default function ProcessDesignPage() {
  const [selectedStage, setSelectedStage] = React.useState(null);
  const [simResults, setSimResults] = React.useState(null);

  const influent = simResults?.influent || null;
  const localResults = simResults?.localResults || null;
  const finalLocal =
    localResults && localResults.length > 0
      ? localResults[localResults.length - 1]
      : null;
  const ml = simResults?.mlRecommendation || null;

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-emerald-50 via-cyan-50 to-sky-50 shadow-sm px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-medium text-emerald-800">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            AI-assisted Process Design
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Wastewater Process Designer
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-xl">
            Model primary, secondary and tertiary stages, then let ML recommend
            an optimized treatment recipe and chemical dosing for your reuse
            target.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-white/80 border border-slate-200 px-3 py-2 text-right">
            <div className="text-slate-500">Selected Stage</div>
            <div className="mt-1 font-semibold text-slate-900">
              {selectedStage
                ? selectedStage.charAt(0).toUpperCase() + selectedStage.slice(1)
                : "None"}
            </div>
          </div>
          <div className="rounded-2xl bg-white/80 border border-slate-200 px-3 py-2 text-right">
            <div className="text-slate-500">Reuse Purpose</div>
            <div className="mt-1 font-semibold text-slate-900 truncate">
              {influent?.reusePurpose || "Not simulated"}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID: FLOW + SIDEPANEL */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: FLOW */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm p-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Process Flow
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click a stage to highlight its units, design notes and impact.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm p-5">
            <ProcessFlow
              selected={selectedStage}
              onSelect={(key) => setSelectedStage(key)}
            />
          </div>
        </div>

        {/* RIGHT: DETAILS & QUICK SUMMARY */}
        <aside className="space-y-4">
          {/* Stage details card */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm p-5">
            <StageDetailCard stageKey={selectedStage} />
          </div>

          {/* Quick control + small KPIs */}
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500 uppercase">
                Quick Actions
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                Scenario mode
              </span>
            </div>
            <div className="space-y-2">
              <button className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                Start Pilot Scenario
              </button>
              <button
                className="w-full rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition"
                style={{
                  background:
                    "linear-gradient(135deg, #059669, #2563eb)", // emerald → blue
                }}
              >
                Export Design Report
              </button>
            </div>

            <div className="pt-3 border-t border-slate-200/70 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Influent Flow</span>
                <span className="font-semibold text-slate-900">
                  {influent?.flow ? `${influent.flow} m³/day` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Final BOD (local)</span>
                <span className="font-semibold text-slate-900">
                  {finalLocal ? `${finalLocal.BOD} mg/L` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Final Turbidity (local)</span>
                <span className="font-semibold text-slate-900">
                  {finalLocal ? `${finalLocal.turbidity} NTU` : "—"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* SIMULATION + AI */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Simulation & AI Recommendation
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Tune influent quality and stage efficiencies. The local model shows
              simple removal; the ML model proposes a realistic treatment recipe
              and chemical doses.
            </p>
          </div>
          {ml && (
            <div className="hidden md:flex flex-col items-end text-xs">
              <span className="text-slate-500">AI Recipe Class</span>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                {ml.recipeClass}
              </span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 shadow-inner p-5 space-y-6">
          {/* Simulator core */}
          <TreatmentSimulator onSimulate={(r) => setSimResults(r)} />

          {/* Results row */}
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Local results table */}
            <div className="xl:col-span-2 rounded-2xl bg-white border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">
                    Stage-wise Performance (Local)
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Calculated using your slider efficiencies for turbidity, BOD
                    and nitrogen.
                  </p>
                </div>
              </div>

              {localResults ? (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 pr-3 text-left">Stage</th>
                        <th className="py-2 px-3 text-right">Turbidity (NTU)</th>
                        <th className="py-2 px-3 text-right">BOD (mg/L)</th>
                        <th className="py-2 px-3 text-right">Total N (mg/L)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localResults.map((row) => (
                        <tr
                          key={row.label}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="py-2 pr-3 text-left font-medium text-slate-900">
                            {row.label}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {row.turbidity}
                          </td>
                          <td className="py-2 px-3 text-right">{row.BOD}</td>
                          <td className="py-2 px-3 text-right">{row.TN}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-3 text-xs text-slate-500">
                  Run a simulation to see how each stage polishes the influent.
                </div>
              )}
            </div>

            {/* AI Recommendation card */}
            <div className="rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 text-emerald-50 p-4 space-y-3 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-100">
                    AI Treatment Recommendation
                  </div>
                  <p className="text-xs text-emerald-50/80 mt-0.5">
                    ML model trained on rule-based design patterns & synthetic
                    scenarios.
                  </p>
                </div>
                {influent?.reusePurpose && (
                  <div className="text-right text-[11px]">
                    <div className="text-emerald-100/70">Target Reuse</div>
                    <div className="mt-0.5 rounded-full bg-emerald-500/20 px-2 py-0.5 font-medium">
                      {influent.reusePurpose}
                    </div>
                  </div>
                )}
              </div>

              {ml ? (
                <>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {ml.recipeLabel}
                    </div>
                    <p className="mt-1 text-[11px] text-emerald-100/80">
                      {ml.recipeDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-[11px]">
                    {["primary", "secondary", "tertiary"].map((stage) => {
                      const items = ml.stages?.[stage];
                      if (!items || !items.length) return null;
                      return (
                        <div
                          key={stage}
                          className="rounded-xl bg-emerald-900/20 border border-emerald-400/40 px-3 py-2"
                        >
                          <div className="font-semibold uppercase text-emerald-50/90">
                            {stage} stage
                          </div>
                          <ul className="mt-1 list-disc list-inside space-y-0.5 text-emerald-50/90">
                            {items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase text-emerald-50/80">
                      Recommended Chemical Doses (mg/L)
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(ml.chemicalDoses || {}).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="rounded-lg bg-emerald-900/25 border border-emerald-400/40 px-3 py-2"
                          >
                            <div className="text-[10px] uppercase text-emerald-100/80">
                              {key.replace("_", " ")}
                            </div>
                            <div className="text-sm font-semibold text-white">
                              {value} mg/L
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-emerald-50/80 mt-2">
                  Run a simulation to fetch an AI-backed treatment recipe and
                  dosing guidance for the current influent profile.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DESIGN NOTES */}
      <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-900">
            Design Notes
          </h3>
          <span className="text-[11px] text-slate-500">
            Use this section to justify your design in reports.
          </span>
        </div>
        <ul className="mt-2 text-sm text-slate-600 list-disc list-inside space-y-1.5">
          <li>
            Balance aeration and RO energy demand with recovery targets to
            optimize OPEX.
          </li>
          <li>
            Use modular SBR basins / MBBR media and RO skids to support phased
            capacity expansion.
          </li>
          <li>
            Provide bypass and isolation lines for safe maintenance and upset
            handling.
          </li>
          <li>
            Validate AI-recommended recipes against local discharge and reuse
            norms before implementation.
          </li>
        </ul>
      </section>
    </div>
  );
}
