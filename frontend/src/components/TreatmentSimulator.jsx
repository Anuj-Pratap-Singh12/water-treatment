// src/components/TreatmentSimulator.jsx
import React, { useState, useMemo, useCallback } from "react";
import { classifyWaterType } from "../utils/waterClassification";
import { chemicalSelectionLogic } from "../utils/chemicalLogic";
import { equipmentSelectionLogic } from "../utils/equipmentLogic";
import { calculateDoses } from "../utils/doseCalculator";

// TODO: replace this with your real water IoT endpoint
const WATER_IOT_URL = "http://localhost:5001/api/iot/water";
// TreatmentSimulator will fetch GPT-generated water data from this endpoint


export default function TreatmentSimulator({ onSimulate }) {
  const [influent, setInfluent] = useState({
    pH: 7.2,
    tds: 1200,
    turbidity: 120,
    BOD: 200,
    COD: 500,
    TN: 45,
    temperature: 30,
    heavyMetals: false,
    flow: 1000,
    totalVolume: 1000000,
    reusePurpose: "Irrigation (non-food)",
  });

  const [eff, setEff] = useState({
    primary: { turbidity: 60, bod: 30, tn: 5 },
    secondary: { turbidity: 20, bod: 70, tn: 40 },
    tertiary: { turbidity: 90, bod: 90, tn: 80 },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [iotLoading, setIotLoading] = useState(false);
  const [iotError, setIotError] = useState("");

  // 🔌 FRONTEND-ONLY: Fetch influent data from backend IoT endpoint (GPT-powered)
  const handleLoadFromIot = useCallback(async () => {
    setIotError("");
    setIotLoading(true);

    try {
      const res = await fetch(WATER_IOT_URL);

      if (!res.ok) {
        throw new Error(`Failed to fetch IoT data: ${res.statusText}`);
      }

      const sensor = await res.json();
      
      console.log("✅ API Response received:", sensor);

      // Expecting something like:
      // {
      //   ph, tds, turbidity, bod, cod, tn,
      //   temperature, flow, totalVolume, heavyMetals, source, timestamp
      // }

      const newInfluent = {
        ...influent,
        pH: sensor.ph ?? influent.pH,
        tds: sensor.tds ?? influent.tds,
        turbidity: sensor.turbidity ?? influent.turbidity,
        BOD: sensor.bod ?? influent.BOD,
        COD: sensor.cod ?? influent.COD,
        TN: sensor.tn ?? influent.TN,
        temperature: sensor.temperature ?? influent.temperature,
        flow: sensor.flow ?? influent.flow,
        totalVolume: sensor.totalVolume ?? influent.totalVolume,
        heavyMetals:
          typeof sensor.heavyMetals === "boolean"
            ? sensor.heavyMetals
            : influent.heavyMetals,
      };
      
      console.log("📋 New Influent State:", newInfluent);
      setInfluent(newInfluent);
      console.log("✅ State updated successfully");
      
    } catch (err) {
      console.error("❌ Error:", err);
      setIotError(
        "Could not load water data from GPT. Check backend is running and OPENAI_API_KEY is set."
      );
    } finally {
      setIotLoading(false);
    }
  }, [influent]);

  // local stage-wise removal simulation
  const simulate = useCallback(() => {
    const seq = ["primary", "secondary", "tertiary"];
    let out = {
      turbidity: influent.turbidity,
      BOD: influent.BOD,
      TN: influent.TN,
    };

    const results = [
      {
        label: "Influent",
        turbidity: Math.round(out.turbidity),
        BOD: Math.round(out.BOD),
        TN: Math.round(out.TN),
      },
    ];

    seq.forEach((stage) => {
      const e = eff[stage];
      out = {
        turbidity: out.turbidity * (1 - e.turbidity / 100),
        BOD: out.BOD * (1 - e.bod / 100),
        TN: out.TN * (1 - e.tn / 100),
      };
      results.push({
        label: stage.charAt(0).toUpperCase() + stage.slice(1),
        turbidity: Math.round(out.turbidity),
        BOD: Math.round(out.BOD),
        TN: Math.round(out.TN),
      });
    });

    return results;
  }, [influent, eff]);

  const preview = useMemo(() => {
    const r = simulate();
    return r[r.length - 1];
  }, [simulate]);

  const NumberInput = ({ label, value, onChange, suffix, full }) => (
    <div className={full ? "col-span-2" : ""}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="p-2 rounded-lg border border-slate-200 w-full text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
        />
        {suffix && <div className="text-xs text-slate-500">{suffix}</div>}
      </div>
    </div>
  );

  const handleSimulateClick = async () => {
    setError("");

    // 1) Local stage simulation
    const localResults = simulate();

    // 2) Rule-based water type classification
    const waterType = classifyWaterType({
      pH: influent.pH,
      tds: influent.tds,
      turbidity: influent.turbidity,
      bod: influent.BOD,
      cod: influent.COD,
      tn: influent.TN,
      temperature: influent.temperature,
    });

    // 3) Chemical & equipment logic + simple dose calculation
    const chemicals = chemicalSelectionLogic({
      pH: influent.pH,
      tds: influent.tds,
      turbidity: influent.turbidity,
      bod: influent.BOD,
      cod: influent.COD,
      tn: influent.TN,
      temperature: influent.temperature,
      heavyMetals: influent.heavyMetals,
    });

    const equipment = equipmentSelectionLogic({
      tds: influent.tds,
      turbidity: influent.turbidity,
      bod: influent.BOD,
      cod: influent.COD,
      temperature: influent.temperature,
      heavyMetals: influent.heavyMetals,
    });

    const doses = calculateDoses({
      turbidity: influent.turbidity,
      cod: influent.COD,
      bod: influent.BOD,
      tds: influent.tds,
    });

    // 4) Call ML backend (same as your original)
    const qualityPayload = {
      pH: influent.pH,
      tds: influent.tds,
      bod: influent.BOD,
      cod: influent.COD,
      turbidity: influent.turbidity,
      temperature: influent.temperature ?? 25,
      heavyMetals: { present: influent.heavyMetals ?? false },
    };

    let mlRecommendation = null;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/ml/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quality: qualityPayload,
          intendedReuse: influent.reusePurpose,
        }),
      });

      if (res.ok) {
        mlRecommendation = await res.json();
      } else {
        setError("ML recommendation failed – check backend logs.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not reach ML service. Is backend + FastAPI running?");
    } finally {
      setLoading(false);

      // 5) Send everything up to ProcessDesignPage
      onSimulate?.({
        influent,
        localResults,
        mlRecommendation,
        waterType,
        chemicals,
        equipment,
        doses,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* TOP GRID: influent + stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Influent quality */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                Influent Quality
              </h4>
              <span className="text-[11px] text-slate-500">
                Raw wastewater – filled from IoT or manual inputs
              </span>
              {iotError && (
                <div className="mt-1 text-[11px] text-red-500">{iotError}</div>
              )}
              {!iotError && !iotLoading && (
                <div className="mt-1 text-[11px] text-slate-400">
                  Last update: {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLoadFromIot}
              disabled={iotLoading}
              className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-medium text-emerald-700 border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {iotLoading ? "Syncing..." : "Sync from GPT IoT"}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <NumberInput
              label="pH"
              value={influent.pH}
              onChange={(v) => setInfluent((s) => ({ ...s, pH: v }))}
            />
            <NumberInput
              label="TDS (mg/L)"
              value={influent.tds}
              onChange={(v) => setInfluent((s) => ({ ...s, tds: v }))}
            />
            <NumberInput
              label="Turbidity (NTU)"
              value={influent.turbidity}
              onChange={(v) => setInfluent((s) => ({ ...s, turbidity: v }))}
            />
            <NumberInput
              label="BOD (mg/L)"
              value={influent.BOD}
              onChange={(v) => setInfluent((s) => ({ ...s, BOD: v }))}
            />
            <NumberInput
              label="COD (mg/L)"
              value={influent.COD}
              onChange={(v) => setInfluent((s) => ({ ...s, COD: v }))}
            />
            <NumberInput
              label="Total Nitrogen (mg/L)"
              value={influent.TN}
              onChange={(v) => setInfluent((s) => ({ ...s, TN: v }))}
            />
            <NumberInput
              label="Temperature (°C)"
              value={influent.temperature}
              onChange={(v) =>
                setInfluent((s) => ({ ...s, temperature: v }))
              }
            />
            <NumberInput
              label="Flow (m³/day)"
              value={influent.flow}
              onChange={(v) => setInfluent((s) => ({ ...s, flow: v }))}
            />
            <NumberInput
              label="Total Volume (L/day)"
              value={influent.totalVolume}
              onChange={(v) =>
                setInfluent((s) => ({ ...s, totalVolume: v }))
              }
              full
            />

            <div className="col-span-2 flex items-center gap-2 mt-1">
              <input
                id="heavyMetals"
                type="checkbox"
                checked={influent.heavyMetals}
                onChange={(e) =>
                  setInfluent((s) => ({
                    ...s,
                    heavyMetals: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="heavyMetals" className="text-xs text-slate-600">
                Heavy metals present in significant concentration
              </label>
            </div>

            <div className="col-span-2 mt-2">
              <div className="text-xs text-slate-500">Reuse Purpose</div>
              <select
                value={influent.reusePurpose}
                onChange={(e) =>
                  setInfluent((s) => ({ ...s, reusePurpose: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option>Irrigation (non-food)</option>
                <option>Industrial Cooling</option>
                <option>Cleaning/Washing</option>
                <option>Construction Use</option>
                <option>Groundwater Recharge</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stage efficiencies */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-slate-900">
              Stage Efficiencies
            </h4>
            <span className="text-[11px] text-slate-500">
              Removal (%) per stage
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {["primary", "secondary", "tertiary"].map((stage) => (
              <div key={stage} className="rounded-xl bg-slate-50/80 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase text-slate-600">
                    {stage} stage
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Turbidity / BOD / N
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  {["turbidity", "bod", "tn"].map((param) => (
                    <div key={param}>
                      <div className="text-[11px] text-slate-500 capitalize">
                        {param === "tn" ? "Total N" : param}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eff[stage][param]}
                        onChange={(e) =>
                          setEff((s) => ({
                            ...s,
                            [stage]: {
                              ...s[stage],
                              [param]: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full"
                      />
                      <div className="text-xs font-semibold text-slate-800">
                        {eff[stage][param]}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM: simulate + preview */}
      <div className="flex flex-col md:flex-row items-start gap-4">
        <button
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleSimulateClick}
          disabled={loading}
        >
          {loading ? "Running simulation..." : "Simulate & Get AI Recipe"}
        </button>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex-1">
          <div className="text-xs text-slate-500">
            Final Effluent (local preview after all stages)
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-[11px] text-slate-500">Turbidity</div>
              <div className="text-lg font-semibold text-slate-900">
                {preview ? preview.turbidity : "—"}{" "}
                <span className="text-xs text-slate-500">NTU</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">BOD</div>
              <div className="text-lg font-semibold text-slate-900">
                {preview ? preview.BOD : "—"}{" "}
                <span className="text-xs text-slate-500">mg/L</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500">Total N</div>
              <div className="text-lg font-semibold text-slate-900">
                {preview ? preview.TN : "—"}{" "}
                <span className="text-xs text-slate-500">mg/L</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            This preview uses simple removal math. The AI card uses the ML model
            and rule engine after you click{" "}
            <span className="font-semibold">Simulate & Get AI Recipe</span>.
          </div>
          {error && (
            <div className="mt-2 text-[11px] text-red-500">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
