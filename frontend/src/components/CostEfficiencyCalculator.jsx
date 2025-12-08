// src/components/CostEfficiencyCalculator.jsx
import React, { useEffect, useMemo, useState } from "react";

// ---- PRICE HELPERS ----

// Approximate bulk prices (₹ / kg). Tune these to your project.
const BASE_PRICES = {
  alum: 12,
  pac: 15,
  polymer: 160,
  chlorine: 20,
  antiscalant: 50,
  ozone: 50,
};

const getPriceForKey = (key) => {
  const k = key.toLowerCase();
  if (k.includes("alum") || k.includes("coagulant")) return BASE_PRICES.alum;
  if (k.includes("pac")) return BASE_PRICES.pac;
  if (k.includes("polymer")) return BASE_PRICES.polymer;
  if (k.includes("chlorine")) return BASE_PRICES.chlorine;
  if (k.includes("antiscalant")) return BASE_PRICES.antiscalant;
  if (k.includes("ozone")) return BASE_PRICES.ozone;
  return 50; // fallback default
};

// Make a nice label from keys like "alumDose" / "polymer_dose"
const prettifyKey = (key) => {
  const lower = key.toLowerCase();
  if (lower.includes("pac")) return "PAC";

  return key
    .replace(/_/g, " ")
    .replace(/dose/gi, "")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
};

const formatNumber = (value) => {
  if (isNaN(value)) return "0.00";
  return Number(value).toFixed(2);
};

/**
 * props:
 *  - doses: object from calculateDoses(), e.g. { alumDose: 36, pacDose: 60, ... } (mg/L)
 *  - flow: influent.flow (m³/day)
 */
export default function CostEfficiencyCalculator({ doses, flow }) {
  const [rows, setRows] = useState([]);

  // mg/L → kg/day factor: dose * flow / 1000
  const massFactor = flow && flow > 0 ? flow / 1000 : 0;

  // Build rows whenever doses change
  useEffect(() => {
    if (!doses || typeof doses !== "object") {
      setRows([]);
      return;
    }

    const entries = Object.entries(doses);

    const newRows = entries.map(([key, value], idx) => ({
      id: idx + 1,
      key,
      label: prettifyKey(key),
      systemDose: Number(value) || 0, // mg/L from simulator
      manualDose: "", // user input (mg/L)
      pricePerKg: getPriceForKey(key),
      unit: "mg/L",
    }));

    setRows(newRows);
  }, [doses]);

  const handleManualChange = (key, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.key === key ? { ...row, manualDose: value } : row
      )
    );
  };

  const totals = useMemo(() => {
    let currentCost = 0;
    let optimizedCost = 0;
    let manualEntered = false;

    if (!massFactor) {
      return { currentCost: 0, optimizedCost: 0, savings: 0, efficiency: 0 };
    }

    rows.forEach((row) => {
      const manualDose = parseFloat(row.manualDose);
      const systemDose = parseFloat(row.systemDose) || 0;
      const price = parseFloat(row.pricePerKg) || 0;

      if (!isNaN(manualDose) && manualDose > 0) {
        manualEntered = true;
      }

      const safeManualDose = !isNaN(manualDose) ? manualDose : 0;

      const manualKgPerDay = safeManualDose * massFactor; // kg/day
      const systemKgPerDay = systemDose * massFactor; // kg/day

      currentCost += manualKgPerDay * price;
      optimizedCost += systemKgPerDay * price;
    });

    // If user hasn't entered any manual dose yet,
    // set profit/loss and efficiency to ZERO.
    let savings = currentCost - optimizedCost;
    let efficiency = currentCost > 0 ? (savings / currentCost) * 100 : 0;

    if (!manualEntered) {
      savings = 0;
      efficiency = 0;
    }

    return { currentCost, optimizedCost, savings, efficiency };
  }, [rows, massFactor]);

  const isSaving = totals.savings > 0;
  const isLoss = totals.savings < 0;

  const hasData = rows.length > 0 && massFactor > 0;

  return (
    <section className="mt-4 rounded-2xl border border-emerald-200 bg-white/60 shadow-sm backdrop-blur-sm p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm md:text-base font-semibold text-emerald-700">
            Cost & Efficiency Calculator
          </h2>
          <p className="text-[11px] md:text-xs text-slate-600">
            Uses the rule-based doses from the Treatment Simulator (mg/L) and
            compares them with your current manual doses.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Linked to Treatment Simulator
          </span>
          {flow ? (
            <span className="text-[10px] text-slate-500">
              Flow assumed: <span className="font-semibold">{flow}</span>{" "}
              m³/day
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">
              Run a simulation to set flow.
            </span>
          )}
        </div>
      </div>

      {!hasData && (
        <div className="mt-3 text-[11px] text-slate-500">
          Run a simulation first to generate dose values and then compare your
          manual dosing cost vs our recommended recipe.
        </div>
      )}

      {hasData && (
        <>
          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b bg-emerald-50 text-[10px] md:text-xs uppercase text-slate-600">
                  <th className="px-3 py-2 text-left">Chemical</th>
                  <th className="px-3 py-2 text-center">
                    Our Dose
                    <span className="block text-[9px] font-normal text-slate-500">
                      (Simulator, mg/L)
                    </span>
                  </th>
                  <th className="px-3 py-2 text-center">
                    Your Dose
                    <span className="block text-[9px] font-normal text-slate-500">
                      (Manual, mg/L)
                    </span>
                  </th>
                  <th className="px-3 py-2 text-center">
                    Price
                    <span className="block text-[9px] font-normal text-slate-500">
                      (₹ / kg)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row) => (
                  <tr key={row.key} className="hover:bg-emerald-50/40">
                    <td className="px-3 py-2 text-slate-800 font-medium">
                      {row.label}
                    </td>

                    {/* system dose */}
                    <td className="px-3 py-2 text-center text-emerald-700 font-semibold">
                      {formatNumber(row.systemDose)}{" "}
                      <span className="text-[9px] text-slate-500">
                        {row.unit}
                      </span>
                    </td>

                    {/* manual dose */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={row.manualDose}
                          onChange={(e) =>
                            handleManualChange(row.key, e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          placeholder="Enter your dose"
                        />
                        <span className="text-[9px] text-slate-500">
                          {row.unit}
                        </span>
                      </div>
                    </td>

                    {/* price: small ₹, larger number */}
                    <td className="px-3 py-2">
                      <div className="flex items-baseline justify-center gap-1 text-slate-800">
                        <span className="text-[9px] font-semibold align-top">
                          ₹
                        </span>
                        <span className="text-xs md:text-sm font-semibold">
                          {formatNumber(row.pricePerKg)}
                        </span>
                        <span className="text-[9px] text-slate-400">/ kg</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
            {/* Current cost */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="text-[10px] font-medium uppercase text-slate-500">
                Your current chemical cost
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[10px] font-semibold text-slate-500 align-top">
                  ₹
                </span>
                <span className="text-lg md:text-xl font-semibold text-slate-800">
                  {formatNumber(totals.currentCost)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                Using your manual doses at this flow.
              </p>
            </div>

            {/* Optimized cost */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3">
              <p className="text-[10px] font-medium uppercase text-emerald-600">
                Cost with our recipe
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[10px] font-semibold text-emerald-100 align-top">
                  ₹
                </span>
                <span className="text-lg md:text-xl font-semibold text-emerald-700">
                  {formatNumber(totals.optimizedCost)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-emerald-600/80">
                Based on simulator doses (mg/L).
              </p>
            </div>

            {/* Profit / loss */}
            <div
              className={`rounded-2xl border p-3 ${
                isSaving
                  ? "border-emerald-300 bg-emerald-50"
                  : isLoss
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="text-[10px] font-medium uppercase text-slate-600">
                Daily profit / loss
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={`text-[10px] font-semibold align-top ${
                    isSaving
                      ? "text-emerald-700"
                      : isLoss
                      ? "text-red-600"
                      : "text-slate-700"
                  }`}
                >
                  ₹
                </span>
                <span
                  className={`text-lg md:text-xl font-semibold ${
                    isSaving
                      ? "text-emerald-700"
                      : isLoss
                      ? "text-red-600"
                      : "text-slate-700"
                  }`}
                >
                  {isSaving && "+"}
                  {formatNumber(totals.savings)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                Positive = saving using our system, negative = extra cost.
              </p>
            </div>

            {/* Efficiency */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-600 text-white p-3">
              <p className="text-[10px] font-medium uppercase">
                Project efficiency
              </p>
              <p className="mt-1 text-lg md:text-xl font-semibold">
                {formatNumber(totals.efficiency)}%
              </p>
              <p className="mt-1 text-[10px] text-emerald-100">
                Savings / current cost × 100.
              </p>
            </div>
          </div>

          <p className="mt-4 text-[10px] leading-relaxed text-slate-500">
            *Doses are treated as mg/L. We convert to kg/day using flow (m³/day)
            from the simulator. Prices are approximate bulk values and should be
            updated per client procurement data.
          </p>
        </>
      )}
    </section>
  );
}
