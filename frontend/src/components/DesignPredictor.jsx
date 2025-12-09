// src/components/DesignPredictor.jsx
import React, { useState, useMemo, useEffect } from "react";

const TYPE_LABELS = {
  1: "Type 1 – Drinking / Potable Water",
  2: "Type 2 – Domestic / Grey Water",
  3: "Type 3 – Treated Wastewater (MBR Recycle)",
  4: "Type 4 – Industrial Effluent",
  5: "Type 5 – High Organic Load Wastewater",
};

export default function DesignPredictor({
  apiBase = "http://127.0.0.1:8000",
  initialValues,
  influent = null,
  equipment = null,
  chemicals = null,
  doses = null,
  waterType = null,
  localResults = null,
  onResult,
}) {
  // -------------------------------
  // 1️⃣ FORM INITIALIZATION (IoT + Simulator)
  // -------------------------------
  const [form, setForm] = useState(
    initialValues || {
      pH: 7.2,
      TDS_mgL: 1200,
      turbidity_NTU: 120,
      BOD_mgL: 200,
      COD_mgL: 500,
      total_nitrogen_mgL: 45,
      temperature_C: 30,
      flow_m3_day: 1000,
      heavy_metals: true,
    }
  );

  // AUTO-SYNC when TreatmentSimulator updates
  useEffect(() => {
    if (!influent) return; // guard

    setForm({
      pH: influent.pH ?? form.pH,
      TDS_mgL: influent.tds ?? form.TDS_mgL,
      turbidity_NTU: influent.turbidity ?? form.turbidity_NTU,
      BOD_mgL: influent.BOD ?? form.BOD_mgL,
      COD_mgL: influent.COD ?? form.COD_mgL,
      total_nitrogen_mgL: influent.TN ?? form.total_nitrogen_mgL,
      temperature_C: influent.temperature ?? form.temperature_C,
      flow_m3_day: influent.flow ?? form.flow_m3_day,
      heavy_metals: influent.heavyMetals ?? form.heavy_metals,
    });
  }, [influent]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  // -------------------------------
  // 2️⃣ ML STAGE TIME STRUCTURE
  // -------------------------------
  const stages = useMemo(() => {
    if (!result || !result.stage_times_min) return [];

    return Object.keys(result.stage_times_min).map((key, index) => {
      const label = key.replace("t_", "").replace("_min", "");

      return {
        id: key,
        index: index + 1,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        time: result.stage_times_min[key],
      };
    });
  }, [result]);

  // -------------------------------
  // 3️⃣ REAL EQUIPMENT MAPPING (from TreatmentSimulator)
  // -------------------------------
  const REAL_EQUIP_MAP = useMemo(() => {
    if (!equipment) return {};

    return {
      Screening: equipment.primary?.join(", "),
      Coagulation: equipment.primary?.join(", "),
      Flocculation: equipment.secondary?.join(", "),
      Sedimentation: equipment.secondary?.join(", "),
      Filtration: equipment.tertiary?.join(", "),
      Disinfection: "UV System",
    };
  }, [equipment]);

  // -------------------------------
  // 4️⃣ HANDLE INPUTS
  // -------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : Number.isNaN(Number(value))
          ? value
          : Number(value),
    }));
  };

  // -------------------------------
  // 5️⃣ SEND ML REQUEST
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch(`${apiBase}/predict-design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setResult(data);
      onResult?.(data);
    } catch (err) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 6️⃣ UI
  // -------------------------------
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            ML Process Design Predictor
          </h2>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Auto-synced with IoT + Simulation influent.
          </p>
        </div>

        {result && (
          <div className="text-right text-[11px]">
            <div className="text-slate-500">Total Cost</div>
            <div className="mt-0.5 text-sm font-bold text-emerald-700">
              ₹ {result.cost_per_m3_inr.toFixed(2)} / m³
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* INPUT FORM */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-1 space-y-3 rounded-xl bg-slate-50 p-3 border"
        >
          <div className="text-[11px] font-semibold text-slate-600 uppercase">
            Auto-synced Influent
          </div>

          {[
            { name: "pH", label: "pH" },
            { name: "TDS_mgL", label: "TDS (mg/L)" },
            { name: "turbidity_NTU", label: "Turbidity (NTU)" },
            { name: "BOD_mgL", label: "BOD (mg/L)" },
            { name: "COD_mgL", label: "COD (mg/L)" },
            { name: "total_nitrogen_mgL", label: "Total Nitrogen (mg/L)" },
            { name: "temperature_C", label: "Temperature (°C)" },
            { name: "flow_m3_day", label: "Flow (m³/day)" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-600">
                {field.label}
              </label>
              <input
                type="number"
                name={field.name}
                value={form[field.name] ?? ""}
                onChange={handleChange}
                className="border rounded-md px-2 py-1 text-xs"
              />
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="heavy_metals"
              name="heavy_metals"
              checked={form.heavy_metals}
              onChange={handleChange}
            />
            <label htmlFor="heavy_metals" className="text-[11px]">
              Heavy metals present
            </label>
          </div>

          {error && <div className="text-[11px] text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-1.5 rounded-md text-xs"
          >
            {loading ? "Predicting..." : "Predict Design"}
          </button>
        </form>

        {/* RESULTS */}
        <div className="lg:col-span-2 space-y-3">
          {!result && !loading && (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 border-dashed border-2 p-5">
              Run simulation → Sync IoT → Predict Design
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center text-xs">
              Running ML...
            </div>
          )}

          {result && !loading && (
            <>
              {/* SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-xs">
                  <div className="text-emerald-700">Predicted Type</div>
                  <div className="font-semibold mt-1">
                    {TYPE_LABELS[result.predicted_type]}
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 text-xs border">
                  <div className="text-slate-500">Cost per m³</div>
                  <div className="font-semibold mt-1">
                    ₹ {result.cost_per_m3_inr.toFixed(2)}
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 text-xs border">
                  <div className="text-slate-500">Retention Time</div>
                  <div className="font-semibold mt-1">
                    {stages.reduce((s, v) => s + v.time, 0).toFixed(1)} min
                  </div>
                </div>
              </div>

              {/* STAGE TABLE */}
              <div className="rounded-xl bg-slate-50 border p-3">
                <div className="flex justify-between mb-2">
                  <div className="text-[11px] font-semibold uppercase">
                    ML Stages + Real Equipment
                  </div>
                </div>

                <table className="min-w-full text-[11px] text-center">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th>#</th>
                      <th>Stage</th>
                      <th>Time (min)</th>
                      <th>Equipment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-white">
                        <td>{s.index}</td>
                        <td className="font-medium">{s.label}</td>
                        <td>{s.time.toFixed(2)}</td>
                        <td>{REAL_EQUIP_MAP[s.label] || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* RAW JSON */}
              <div className="rounded-xl bg-white border p-3 text-[11px]">
                <button
                  onClick={() => setShowRaw((v) => !v)}
                  className="underline"
                >
                  {showRaw ? "Hide raw" : "Show raw"}
                </button>

                {showRaw && (
                  <pre className="mt-2 bg-slate-900 text-emerald-100 p-2 rounded-md text-[10px] max-h-48 overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
