// src/pages/ProcessDesignPage.jsx
import React from "react";
import jsPDF from "jspdf";
import ProcessFlow from "../components/ProcessFlow";
import StageDetailCard from "../components/StageDetailCard";
import TreatmentSimulator from "../components/TreatmentSimulator";
import { StagePerformanceChart, ChemicalDoseChart } from "../components/ProcessCharts";
import ProcessDesignFlowchart from "../components/ProcessDesignFlowchart"; // ✅ NEW

export default function ProcessDesignPage() {
  const [selectedStage, setSelectedStage] = React.useState(null);
  const [simResults, setSimResults] = React.useState(null);

  const influent = simResults?.influent || null;
  const localResults = simResults?.localResults || null;
  const ml = simResults?.mlRecommendation || null;
  const waterType = simResults?.waterType || null;
  const chemicals = simResults?.chemicals || [];
  const equipment = simResults?.equipment || null;
  const doses = simResults?.doses || null;

  const finalLocal =
    localResults && localResults.length > 0
      ? localResults[localResults.length - 1]
      : null;

  const chemicalDoses =
    ml?.chemicalDoses || ml?.chemical_doses || {};

  const primarySteps = Array.isArray(waterType?.primary)
    ? waterType.primary
    : [];
  const secondarySteps = Array.isArray(waterType?.secondary)
    ? waterType.secondary
    : [];
  const tertiarySteps = Array.isArray(waterType?.tertiary)
    ? waterType.tertiary
    : [];

  const severity = waterType?.severity || "unknown";

  const severityClass =
    severity === "very_low"
      ? "bg-emerald-100 text-emerald-700"
      : severity === "low"
      ? "bg-sky-100 text-sky-700"
      : severity === "medium"
      ? "bg-amber-100 text-amber-700"
      : severity === "high"
      ? "bg-orange-100 text-orange-700"
      : severity === "very_high"
      ? "bg-rose-100 text-rose-700"
      : "bg-slate-100 text-slate-700";

  const downloadReport = () => {
    if (!simResults) return;
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(14);
    doc.text("Water Treatment Detailed Report", 10, y);
    y += 8;

    doc.setFontSize(11);
    if (waterType) {
      doc.text(`Water Type: ${waterType.label}`, 10, y);
      y += 6;
      if (waterType.description) {
        doc.text(`Description: ${waterType.description}`, 10, y);
        y += 6;
      }
    }

    if (influent) {
      doc.text("Influent Quality:", 10, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(
        `pH: ${influent.pH}, TDS: ${influent.tds} mg/L, Turbidity: ${influent.turbidity} NTU`,
        10,
        y
      );
      y += 5;
      doc.text(
        `BOD: ${influent.BOD} mg/L, COD: ${influent.COD} mg/L, TN: ${influent.TN} mg/L`,
        10,
        y
      );
      y += 5;
      doc.text(
        `Temperature: ${influent.temperature} °C, Flow: ${influent.flow} m³/day`,
        10,
        y
      );
      y += 8;
      doc.setFontSize(11);
    }

    if (equipment) {
      doc.text("Selected Equipment:", 10, y);
      y += 6;
      doc.setFontSize(10);
      if (Array.isArray(equipment.primary) && equipment.primary.length) {
        doc.text("Primary:", 10, y);
        y += 5;
        equipment.primary.forEach((e) => {
          doc.text(`- ${e}`, 14, y);
          y += 5;
        });
      }
      if (Array.isArray(equipment.secondary) && equipment.secondary.length) {
        doc.text("Secondary:", 10, y);
        y += 5;
        equipment.secondary.forEach((e) => {
          doc.text(`- ${e}`, 14, y);
          y += 5;
        });
      }
      if (Array.isArray(equipment.tertiary) && equipment.tertiary.length) {
        doc.text("Tertiary:", 10, y);
        y += 5;
        equipment.tertiary.forEach((e) => {
          doc.text(`- ${e}`, 14, y);
          y += 5;
        });
      }
      y += 4;
      doc.setFontSize(11);
    }

    if (chemicals.length) {
      doc.text("Chemical Selection:", 10, y);
      y += 6;
      doc.setFontSize(10);
      chemicals.forEach((c) => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        doc.text(
          `- ${c.chemical} (${c.stage}): ${c.reason}`,
          10,
          y
        );
        y += 5;
      });
      y += 4;
      doc.setFontSize(11);
    }

    if (doses) {
      doc.text("Dose Calculation (mg/L):", 10, y);
      y += 6;
      doc.setFontSize(10);
      Object.entries(doses).forEach(([k, v]) => {
        doc.text(`- ${k}: ${v}`, 10, y);
        y += 5;
      });
      y += 4;
      doc.setFontSize(11);
    }

    if (ml && Object.keys(chemicalDoses).length > 0) {
      doc.text("ML Model Chemical Doses (mg/L):", 10, y);
      y += 6;
      doc.setFontSize(10);
      Object.entries(chemicalDoses).forEach(([k, v]) => {
        doc.text(`- ${k}: ${v}`, 10, y);
        y += 5;
      });
    }

    doc.save("water_treatment_report.pdf");
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
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
            Configure your influent, simulate stage-wise removal and let the
            rule engine + ML recommend optimized treatment, equipment and chemical dosing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-white/80 border border-slate-200 px-3 py-2 text-right">
            <div className="text-slate-500">Selected Stage</div>
            <div className="mt-1 font-semibold text-slate-900">
              {selectedStage
                ? selectedStage.charAt(0).toUpperCase() +
                  selectedStage.slice(1)
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

      {/* MAIN: FLOW + SIDEPANEL */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Process flow */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Process Flow
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Click a stage to explore units and design notes.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <ProcessFlow
              selected={selectedStage}
              onSelect={(key) => setSelectedStage(key)}
            />
          </div>
        </div>

        {/* Side panel */}
        <aside className="space-y-4">
          {/* Stage details */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <StageDetailCard stageKey={selectedStage} />
          </div>

          {/* Quick summary */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500 uppercase">
                Quick Summary
              </div>
            </div>
            <div className="space-y-1 text-xs">
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

      {/* SIMULATION + RESULTS */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Simulation & Recommendations
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Run a scenario and compare stage-wise performance, water type classification,
              equipment, chemicals and ML-backed recipe.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-inner p-5 space-y-6">
          {/* Simulator */}
          <TreatmentSimulator onSimulate={(r) => setSimResults(r)} />

          {/* RESULTS GRID */}
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* LEFT: table + Detailed Treatment Report */}
            <div className="xl:col-span-2 space-y-4">
              {/* Local stage-wise table */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="flex flex-col items-center text-center mb-3">
                  <div className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
                    Stage-wise Performance (Local)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-md">
                    Simple removal based on the efficiency sliders.
                  </p>
                </div>

                {localResults ? (
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full text-xs text-center">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2 px-3">Stage</th>
                          <th className="py-2 px-3">Turbidity (NTU)</th>
                          <th className="py-2 px-3">BOD (mg/L)</th>
                          <th className="py-2 px-3">Total N (mg/L)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {localResults.map((row) => (
                          <tr
                            key={row.label}
                            className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-2 px-3 font-medium text-slate-900">
                              {row.label}
                            </td>
                            <td className="py-2 px-3">{row.turbidity}</td>
                            <td className="py-2 px-3">{row.BOD}</td>
                            <td className="py-2 px-3">{row.TN}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-slate-500 text-center">
                    Run a simulation to see stage-wise values.
                  </div>
                )}

                {localResults && (
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className="text-[11px] font-semibold text-slate-500 mb-2">
                      Trend View
                    </div>
                    <StagePerformanceChart localResults={localResults} />
                  </div>
                )}
              </div>

              {/* DETAILED TREATMENT REPORT CARD (moved left under table) */}
              {simResults && (
                <div className="rounded-2xl border border-slate-300 bg-white shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      Detailed Treatment Report
                    </h3>
                    <button
                      onClick={downloadReport}
                      className="rounded-full bg-emerald-600 text-white px-3 py-1 text-[11px] hover:bg-emerald-700"
                    >
                      Download PDF
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-[11px]">
                    {/* Equipment detail */}
                    <div className="p-3 rounded-xl bg-slate-50 border">
                      <div className="font-semibold text-slate-700 mb-1">
                        Equipment Used
                      </div>
                      {equipment ? (
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                          {Array.isArray(equipment.primary) &&
                            equipment.primary.map((e) => (
                              <li key={`p-${e}`}>
                                <span className="font-semibold">[Primary] </span>
                                {e}
                              </li>
                            ))}
                          {Array.isArray(equipment.secondary) &&
                            equipment.secondary.map((e) => (
                              <li key={`s-${e}`}>
                                <span className="font-semibold">[Secondary] </span>
                                {e}
                              </li>
                            ))}
                          {Array.isArray(equipment.tertiary) &&
                            equipment.tertiary.map((e) => (
                              <li key={`t-${e}`}>
                                <span className="font-semibold">[Tertiary] </span>
                                {e}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500">
                          Run simulation to compute equipment selection.
                        </p>
                      )}
                    </div>

                    {/* Chemicals detail */}
                    <div className="p-3 rounded-xl bg-slate-50 border">
                      <div className="font-semibold text-slate-700 mb-1">
                        Chemicals & Rationale
                      </div>
                      {chemicals && chemicals.length ? (
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                          {chemicals.map((c) => (
                            <li key={c.chemical}>
                              <span className="font-semibold">{c.chemical}</span>{" "}
                              <span className="text-slate-500">
                                ({c.stage}) – {c.reason}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500">
                          No chemical logic triggered for this scenario.
                        </p>
                      )}
                    </div>

                    {/* Dose summary */}
                    <div className="p-3 rounded-xl bg-slate-50 border">
                      <div className="font-semibold text-slate-700 mb-1">
                        Rule-based Dose Estimates (mg/L)
                      </div>
                      {doses ? (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(doses).map(([k, v]) => (
                            <div
                              key={k}
                              className="rounded-lg bg-white border px-2 py-1"
                            >
                              <div className="text-[10px] uppercase text-slate-500">
                                {k}
                              </div>
                              <div className="text-xs font-semibold text-slate-900">
                                {v}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500">
                          No dose information available.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dose summary (existing placeholder, if you want to reuse later) */}
                  <div className="p-3 rounded-xl bg-slate-50 border">
                    {/* ...your existing dose summary code... */}
                  </div>

                  {/* Chemical chart */}
                  <div className="p-3 rounded-xl bg-white border">
                    <div className="font-semibold text-slate-700 mb-1">
                      Chemical Dose Chart (mg/L)
                    </div>
                    <ChemicalDoseChart doses={doses} chemicalDoses={chemicalDoses} />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: AI Recommendation + Water type */}
            <div className="space-y-4">
              {/* AI Recommendation card */}
              <div className="rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 text-emerald-50 p-4 space-y-3 shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-100">
                      AI Treatment Recommendation
                    </div>
                    <p className="text-[11px] text-emerald-50/80 mt-0.5">
                      ML model based on synthetic rule-engine patterns.
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
                        {ml.recipeLabel || ml.recipe_class || "AI Recipe"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold uppercase text-emerald-50/80">
                        Recommended Chemical Doses (mg/L)
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        {Object.keys(chemicalDoses).length > 0 ? (
                          Object.entries(chemicalDoses).map(([key, value]) => (
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
                          ))
                        ) : (
                          <div className="text-[11px] text-emerald-100/80 mt-1">
                            No chemical dose data returned from ML service.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-[11px] text-emerald-50/80 mt-2">
                    Run a simulation to fetch an AI-backed treatment recipe and
                    dosing guidance.
                  </div>
                )}
              </div>

              {/* WATER TYPE + STANDARD TREATMENT BOX */}
              {waterType && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                  <div>
                    <div className="text-[11px] uppercase font-semibold text-slate-500 tracking-wide">
                      Water Category (Rule-based)
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {waterType.label || "Classified water type"}
                    </div>
                    {waterType.description && (
                      <p className="text-[11px] text-slate-600 mt-1">
                        {waterType.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 text-[11px] font-medium rounded-full ${severityClass}`}
                    >
                      Severity: {severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-[11px]">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-semibold uppercase text-slate-700 text-[11px]">
                        Primary Treatment
                      </div>
                      {primarySteps.length ? (
                        <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
                          {primarySteps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-slate-500">
                          No primary steps defined in classifier.
                        </p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-semibold uppercase text-slate-700 text-[11px]">
                        Secondary Treatment
                      </div>
                      {secondarySteps.length ? (
                        <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
                          {secondarySteps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-slate-500">
                          No secondary steps defined in classifier.
                        </p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-semibold uppercase text-slate-700 text-[11px]">
                        Tertiary / Advanced Treatment
                      </div>
                      {tertiarySteps.length ? (
                        <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
                          {tertiarySteps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-slate-500">
                          No tertiary steps defined in classifier.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ NEW SECTION: STANDARD TREATMENT FLOWCHARTS FOR 5 WATER TYPES */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Standard Treatment Trains (All Water Types)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Visual flowchart of typical unit processes for each water category.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-inner p-5">
          <ProcessDesignFlowchart />
        </div>
      </section>

      {/* DESIGN NOTES */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-900">
            Design Notes
          </h3>
          <span className="text-[11px] text-slate-500">
            Summarize your design rationale here.
          </span>
        </div>
        <ul className="mt-2 text-sm text-slate-600 list-disc list-inside space-y-1.5">
          <li>
            Balance aeration and RO energy demand with recovery targets to
            optimize OPEX.
          </li>
          <li>
            Use modular bioreactors and RO skids to support future capacity
            expansion.
          </li>
          <li>
            Provide bypass and isolation lines for safe maintenance and upset
            handling.
          </li>
          <li>
            Validate all AI / rule-based suggestions against local standards
            before implementation.
          </li>
        </ul>
      </section>
    </div>
  );
}
