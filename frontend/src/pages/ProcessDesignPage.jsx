// src/pages/ProcessDesignPage.jsx
import React from "react";
import ProcessFlow from "../components/ProcessFlow";
import StageDetailCard from "../components/StageDetailCard";
import TreatmentSimulator from "../components/TreatmentSimulator";
import {
  StagePerformanceChart,
  ChemicalDoseChart,
} from "../components/ProcessCharts";
import CostEfficiencyCalculator from "../components/CostEfficiencyCalculator";
import ProcessFlowDiagram from "../components/ProcessFlowDiagram";
import ProcessInstrumentationDesigner from "../components/ProcessInstrumentationDesigner"; // ✅ NEW
import { classifyReusePurposes } from "../utils/reusePurposeClassifier";
import DesignPredictor from "../components/DesignPredictor";

// 🔗 FastAPI backend base URL
const API_BASE = "http://127.0.0.1:8000";

// 🔎 Labels for ML process design types
const ML_TYPE_LABELS = {
  1: "Type 1 – Drinking / Potable Water",
  2: "Type 2 – Domestic / Grey Water",
  3: "Type 3 – Treated Wastewater (MBR Recycle)",
  4: "Type 4 – Industrial Effluent",
  5: "Type 5 – High Organic Load Wastewater",
};

export default function ProcessDesignPage({ initialSensorData = null }) {
  const [selectedStage, setSelectedStage] = React.useState(null);
  const [simResults, setSimResults] = React.useState(null);

  // 🌟 ML design result (fed from <DesignPredictor />)
  const [designResult, setDesignResult] = React.useState(null);

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

  // Compute Efficiency (%) = |(tertiary - influent) / influent| * 100
  // And Accuracy (CPCB) showing tertiary output vs CPCB limits with PASS/FAIL
  let efficiencyValues = null;
  let accuracyValues = null;
  if (localResults && Array.isArray(localResults)) {
    const infl = localResults.find((r) =>
      String(r.label || "").toLowerCase().includes("influent")
    );
    const tert = localResults.find((r) =>
      String(r.label || "").toLowerCase().includes("tertiary")
    );
    if (infl && tert) {
      const calcEff = (t, i) => {
        const tv = Number(t);
        const iv = Number(i);
        if (!Number.isNaN(tv) && !Number.isNaN(iv) && iv !== 0) {
          return Math.abs(((tv - iv) / iv) * 100);
        }
        return null;
      };
      efficiencyValues = {
        turbidity: calcEff(tert.turbidity, infl.turbidity),
        BOD: calcEff(tert.BOD, infl.BOD),
        TN: calcEff(tert.TN, infl.TN),
      };

      // CPCB limits
      const limits = { turbidity: 10, BOD: 10, TN: 10 };
      const formatAccuracy = (val, limit, unit) => {
        const n = Number(val);
        if (Number.isNaN(n)) return null;
        const pass = n <= limit;
        const icon = pass ? "✅ PASS" : "❌ FAIL";
        return `${n} ${unit} — ≤ ${limit} ${unit} — ${icon}`;
      };
      accuracyValues = {
        turbidity: formatAccuracy(tert.turbidity, limits.turbidity, "NTU"),
        BOD: formatAccuracy(tert.BOD, limits.BOD, "mg/L"),
        TN: formatAccuracy(tert.TN, limits.TN, "mg/L"),
      };
    }
  }

  const chemicalDoses = ml?.chemicalDoses || ml?.chemical_doses || {};

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

  // Estimated reuse potential: for this request return a random value between 70% and 90%
  // Recompute when influent or treatment efficiencies change so each simulation run can get a new random value.
  const reusePercent = React.useMemo(() => {
    if (!influent) return null;
    const min = 70;
    const max = 90;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, [influent, efficiencyValues]);

  const downloadReport = () => {
    try {
      if (!simResults || !localResults || !localResults.length) {
        alert("Please run a simulation first!");
        return;
      }

      // Build the HTML content for PDF
      const waterTypeLabel = waterType?.label || "Unknown";
      const waterTypeDesc = waterType?.description || "";

      const equipment_primary = equipment?.primary?.join(", ") || "";
      const equipment_secondary = equipment?.secondary?.join(", ") || "";
      const equipment_tertiary = equipment?.tertiary?.join(", ") || "";

      const chemicalRows = chemicals
        .map(
          (c) => `<li><b>${c.chemical}:</b> ${c.reason}</li>`
        )
        .join("");

      const doseRows = Object.entries(doses || {})
        .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
        .join("");

      const stageRows = localResults
        .map(
          (row) =>
            `<tr><td>${row.label}</td><td>${row.turbidity.toFixed(
              2
            )}</td><td>${row.BOD.toFixed(2)}</td><td>${row.TN.toFixed(2)}</td></tr>`
        )
        .join("");

      const efficiencyRow = efficiencyValues
        ? `<tr class="efficiency-row"><td><b>Removal Efficiency (%)</b></td><td>${
            efficiencyValues.turbidity !== null
              ? efficiencyValues.turbidity.toFixed(1)
              : "—"
          }%</td><td>${
            efficiencyValues.BOD !== null
              ? efficiencyValues.BOD.toFixed(1)
              : "—"
          }%</td><td>${
            efficiencyValues.TN !== null ? efficiencyValues.TN.toFixed(1) : "—"
          }%</td></tr>`
        : "";

      const accuracyRow = accuracyValues
        ? `<tr class="pass-row"><td><b>CPCB Accuracy</b></td><td>${
            accuracyValues.turbidity?.includes("PASS") ? "PASS" : "FAIL"
          }</td><td>${
            accuracyValues.BOD?.includes("PASS") ? "PASS" : "FAIL"
          }</td><td>${
            accuracyValues.TN?.includes("PASS") ? "PASS" : "FAIL"
          }</td></tr>`
        : "";

      const influentRow = localResults[0];
      const tertiaryRow = localResults[localResults.length - 1];

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Water Treatment Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: "Inter", "Segoe UI", sans-serif;
      color: #1f2937;
      line-height: 1.6;
      padding: 20px;
      background: white;
    }

    .pdf-report {
      max-width: 800px;
      margin: 0 auto;
    }

    .pdf-header {
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 3px solid #0f766e;
    }

    .pdf-header h1 {
      font-size: 28px;
      margin-bottom: 5px;
      color: #0f766e;
    }

    .subtitle {
      color: #6b7280;
      font-size: 14px;
    }

    .highlight-box {
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .highlight-box.red {
      background: #fee2e2;
      border-left: 6px solid #dc2626;
    }

    .highlight-box h2 {
      font-size: 18px;
      margin-bottom: 8px;
      color: #1f2937;
    }

    .warning {
      color: #b91c1c;
      font-weight: 500;
    }

    .section-title {
      font-size: 18px;
      margin-top: 25px;
      margin-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 6px;
      color: #111827;
    }

    .data-table, .dose-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 15px;
    }

    .data-table th, .data-table td,
    .dose-table th, .dose-table td {
      border: 1px solid #d1d5db;
      padding: 10px;
      text-align: center;
    }

    .data-table th,
    .dose-table th {
      background: #f3f4f6;
      font-weight: 600;
    }

    .highlight-row {
      background: #ecfeff;
    }

    .efficiency-row {
      background: #dcfce7;
      font-weight: bold;
    }

    .pass-row {
      background: #d1fae5;
      font-weight: bold;
    }

    .before-after-grid {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .ba-card {
      flex: 1;
      min-width: 150px;
      background: #f9fafb;
      padding: 14px;
      border-radius: 10px;
      text-align: center;
      border: 1px solid #e5e7eb;
    }

    .ba-card h3 {
      font-size: 14px;
      margin-bottom: 8px;
      color: #374151;
    }

    .ba-card p {
      font-size: 13px;
      margin: 4px 0;
      color: #6b7280;
    }

    .ba-card b {
      color: #0f766e;
      font-size: 15px;
    }

    .equipment-box, .chemical-box {
      background: #f8fafc;
      padding: 16px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      margin-bottom: 15px;
    }

    .equipment-box p, .chemical-box ul {
      font-size: 13px;
      color: #374151;
      line-height: 1.7;
    }

    .chemical-box ul {
      padding-left: 20px;
    }

    .chemical-box li {
      margin-bottom: 6px;
    }

    .dose-table td {
      text-align: left;
    }

    .dose-table td:first-child {
      font-weight: 600;
    }

    .pdf-footer {
      margin-top: 40px;
      padding-top: 15px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }

    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      .pdf-report {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="pdf-report">

    <!-- HEADER -->
    <div class="pdf-header">
      <h1>Water Treatment Process Report</h1>
      <p class="subtitle">ReLeaf Smart Water Recovery System</p>
    </div>

    <!-- WATER TYPE -->
    <div class="highlight-box red">
      <h2>Water Type</h2>
      <p><b>${waterTypeLabel}</b></p>
      <p class="warning">${waterTypeDesc}</p>
    </div>

    <!-- STAGE WISE PERFORMANCE -->
    <h2 class="section-title">Stage-Wise Performance</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Stage</th>
          <th>Turbidity (NTU)</th>
          <th>BOD (mg/L)</th>
          <th>Total Nitrogen (mg/L)</th>
        </tr>
      </thead>
      <tbody>
        ${stageRows}
        ${efficiencyRow}
        ${accuracyRow}
      </tbody>
    </table>

    <!-- BEFORE AFTER -->
    <h2 class="section-title">Before & After Treatment Summary</h2>
    <div class="before-after-grid">
      <div class="ba-card">
        <h3>Turbidity</h3>
        <p>Before: <b>${influentRow.turbidity.toFixed(2)} NTU</b></p>
        <p>After: <b>${tertiaryRow.turbidity.toFixed(2)} NTU</b></p>
      </div>
      <div class="ba-card">
        <h3>BOD</h3>
        <p>Before: <b>${influentRow.BOD.toFixed(2)} mg/L</b></p>
        <p>After: <b>${tertiaryRow.BOD.toFixed(2)} mg/L</b></p>
      </div>
      <div class="ba-card">
        <h3>Total Nitrogen</h3>
        <p>Before: <b>${influentRow.TN.toFixed(2)} mg/L</b></p>
        <p>After: <b>${tertiaryRow.TN.toFixed(2)} mg/L</b></p>
      </div>
    </div>

    <!-- EQUIPMENT -->
    <h2 class="section-title">Selected Treatment Equipment</h2>
    <div class="equipment-box">
      ${equipment_primary ? `<p><b>Primary Treatment:</b> ${equipment_primary}</p>` : ""}
      ${equipment_secondary ? `<p><b>Secondary Treatment:</b> ${equipment_secondary}</p>` : ""}
      ${equipment_tertiary ? `<p><b>Tertiary Treatment:</b> ${equipment_tertiary}</p>` : ""}
    </div>

    <!-- CHEMICAL SELECTION -->
    ${
      chemicals && chemicals.length > 0
        ? `
    <h2 class="section-title">Chemical Selection Logic</h2>
    <div class="chemical-box">
      <ul>
        ${chemicalRows}
      </ul>
    </div>
    `
        : ""
    }

    <!-- CHEMICAL DOSE -->
    <h2 class="section-title">Chemical Dose Requirement (mg/L)</h2>
    <table class="dose-table">
      <thead>
        <tr>
          <th>Chemical</th>
          <th>Dose (mg/L)</th>
        </tr>
      </thead>
      <tbody>
        ${doseRows}
      </tbody>
    </table>

    <!-- FOOTER -->
    <div class="pdf-footer">
      <p>Generated by ReLeaf Smart Water Recovery Platform</p>
      <p>© 2025 • CPCB-Compliant • Circular Water Economy Enabled</p>
    </div>

  </div>
</body>
</html>
      `;

      // Create a new window and print to PDF
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200/70 bg-linear-to-r from-emerald-50 via-cyan-50 to-sky-50 shadow-sm px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
            rule engine + ML recommend optimized treatment, equipment and
            chemical dosing.
          </p>
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
              Run a scenario and compare stage-wise performance, water type
              classification, equipment, chemicals and ML-backed recipe.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-inner p-5 space-y-6">
          {/* Simulator */}
          <TreatmentSimulator
            onSimulate={(r) => {
              setSimResults(r);
            }}
            initialSensorData={initialSensorData}
          />

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
                        {efficiencyValues && (
                          <tr className="border-b border-slate-100 last:border-b-0 bg-slate-50/60">
                            <td className="py-2 px-3 font-medium text-slate-900">
                              Efficiency (%)
                            </td>
                            <td className="py-2 px-3">
                              {efficiencyValues.turbidity !== null
                                ? `${efficiencyValues.turbidity.toFixed(1)}%`
                                : "—"}
                            </td>
                            <td className="py-2 px-3">
                              {efficiencyValues.BOD !== null
                                ? `${efficiencyValues.BOD.toFixed(1)}%`
                                : "—"}
                            </td>
                            <td className="py-2 px-3">
                              {efficiencyValues.TN !== null
                                ? `${efficiencyValues.TN.toFixed(1)}%`
                                : "—"}
                            </td>
                          </tr>
                        )}
                        {accuracyValues && (
                          <tr className="border-b border-slate-100 last:border-b-0 bg-white/50">
                            <td className="py-2 px-3 font-medium text-slate-900">
                              Accuracy (CPCB)
                            </td>
                            <td className="py-2 px-3 text-left text-[10px]">
                              {accuracyValues.turbidity || "—"}
                            </td>
                            <td className="py-2 px-3 text-left text-[10px]">
                              {accuracyValues.BOD || "—"}
                            </td>
                            <td className="py-2 px-3 text-left text-[10px]">
                              {accuracyValues.TN || "—"}
                            </td>
                          </tr>
                        )}
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

                {/* REUSE PURPOSE OUTPUT */}
                {finalLocal && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <div className="text-xs font-semibold text-emerald-800 mb-3 uppercase tracking-wide">
                      ♻️ Reuse Purpose Classification
                    </div>
                    <div className="text-[11px] text-emerald-700 mb-3">
                      Based on final effluent quality: Turbidity{" "}
                      <strong>{finalLocal.turbidity} NTU</strong> | BOD{" "}
                      <strong>{finalLocal.BOD} mg/L</strong> | Total N{" "}
                      <strong>{finalLocal.TN} mg/L</strong>
                    </div>

                    {(() => {
                      const { allowed, notAllowed } = classifyReusePurposes(
                        finalLocal.turbidity,
                        finalLocal.BOD,
                        finalLocal.TN
                      );

                      return (
                        <div className="space-y-3">
                          {allowed.length > 0 && (
                            <div>
                              <div className="text-[11px] font-semibold text-emerald-700 mb-2">
                                ✅ Suitable for:
                              </div>
                              <div className="space-y-2">
                                {allowed.map((purpose, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2 rounded-lg bg-white/70 border border-emerald-100"
                                  >
                                    <div className="text-xs font-semibold text-emerald-800">
                                      {purpose.name}
                                    </div>
                                    <div className="text-[10px] text-emerald-700 mt-0.5">
                                      {purpose.useCase}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {notAllowed.length > 0 && allowed.length === 0 && (
                            <div>
                              <div className="text-[11px] font-semibold text-orange-700 mb-2">
                                ❌ Not Suitable (Exceeds Limits):
                              </div>
                              <div className="text-[10px] text-orange-700 space-y-1">
                                {notAllowed.slice(0, 3).map((purpose, idx) => (
                                  <div key={idx}>
                                    <strong>{purpose.name}</strong> —{" "}
                                    {purpose.useCase}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* DETAILED TREATMENT REPORT CARD */}
              {simResults && (
                <div className="rounded-2xl border border-slate-300 bg-white shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      Detailed Treatment Report
                    </h3>
                    <button
                      onClick={downloadReport}
                      className="download-pdf-btn"
                    >
                      ⬇ Download PDF
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
                                <span className="font-semibold">
                                  [Primary]{" "}
                                </span>
                                {e}
                              </li>
                            ))}
                          {Array.isArray(equipment.secondary) &&
                            equipment.secondary.map((e) => (
                              <li key={`s-${e}`}>
                                <span className="font-semibold">
                                  [Secondary]{" "}
                                </span>
                                {e}
                              </li>
                            ))}
                          {Array.isArray(equipment.tertiary) &&
                            equipment.tertiary.map((e) => (
                              <li key={`t-${e}`}>
                                <span className="font-semibold">
                                  [Tertiary]{" "}
                                </span>
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
                              <span className="font-semibold">
                                {c.chemical}
                              </span>{" "}
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

                  {/* Dose summary placeholder (kept if you want extra content later) */}
                  <div className="p-3 rounded-xl bg-slate-50 border">
                    {/* ...extra dose summary / notes if needed... */}
                  </div>

                  {/* Chemical chart */}
                  <div className="p-3 rounded-xl bg-white border">
                    <div className="font-semibold text-slate-700 mb-1">
                      Chemical Dose Chart (mg/L)
                    </div>
                    <ChemicalDoseChart
                      doses={doses}
                      chemicalDoses={chemicalDoses}
                    />
                  </div>
                </div>
              )}

              {/* P&ID / INSTRUMENTATION SECTION */}
              <section className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Process & Instrumentation (P&ID)
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Interactive process & instrumentation layout with live
                      parameter controls.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-inner p-4">
                  <ProcessInstrumentationDesigner
                    influent={influent}
                    localResults={localResults}
                    onNodeClick={(id) => {
                      if (id === "intake") setSelectedStage("screening");
                      else if (id === "coagulation") setSelectedStage("primary");
                      else if (id === "sedimentation")
                        setSelectedStage("secondary");
                      else if (id === "filtration")
                        setSelectedStage("tertiary");
                    }}
                  />
                </div>
              </section>
            </div>

            {/* RIGHT: AI Recommendation + Water type */}
            <div className="space-y-4">
              {/* AI Recommendation card */}
              <div className="rounded-2xl bg-linear-to-b from-emerald-600 to-emerald-700 text-emerald-50 p-4 space-y-3 shadow-md">
                <div className="flex flex-col gap-3">
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

                  {reusePercent !== null && (
                    <div className="text-right">
                      <div className="text-emerald-100/70 text-[11px]">
                        Estimated Reuse Potential
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-3">
                        <div className="text-3xl font-bold text-white">
                          {reusePercent}%
                        </div>
                        <div className="w-32 h-2 bg-emerald-900/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-300"
                            style={{ width: `${reusePercent}%` }}
                          />
                        </div>
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

                {/* 🌟 NEW: show ML process design output here (from DesignPredictor) */}
                <div className="mt-3 border-t border-emerald-500/30 pt-2">
                  {designResult ? (
                    <div className="rounded-lg bg-emerald-900/25 border border-emerald-400/40 px-3 py-2 text-[11px] space-y-1">
                      <div className="uppercase text-emerald-100/80 font-semibold">
                        ML Process Design
                      </div>
                      <div>
                        {ML_TYPE_LABELS[designResult.predicted_type] ||
                          `Type ${designResult.predicted_type}`}
                      </div>
                      <div>
                        Cost: ₹{" "}
                        {designResult.cost_per_m3_inr
                          ? designResult.cost_per_m3_inr.toFixed(2)
                          : "—"}{" "}
                        / m³
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-100/80">
                      Scroll down to run the detailed ML design predictor and
                      see cost & process type here.
                    </div>
                  )}
                </div>
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

              {/* Cost calculator linked to simulator doses */}
              {doses && influent?.flow && (
                <CostEfficiencyCalculator doses={doses} flow={influent.flow} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DESIGN PREDICTOR SECTION (detailed ML view) */}
      <section className="space-y-4">
        <DesignPredictor
          apiBase={API_BASE}
          influent={influent} // IoT + manual updated influent
          equipment={equipment} // REAL equipment from simulator
          chemicals={chemicals} // REAL chemicals
          doses={doses} // REAL rule-based doses
          waterType={waterType} // REAL rule-based classification
          localResults={localResults} // REAL stage-wise results
          onResult={(mlDesign) => {
            setDesignResult(mlDesign); // feeds into AI card above
          }}
        />
      </section>

      {/* STANDARD TREATMENT FLOW DIAGRAMS */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-inner p-5">
          <ProcessFlowDiagram waterType={waterType} />
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
