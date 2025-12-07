// src/pages/SensorsPage.jsx
import React from "react";
import { getMockSensors } from "../services/mockApi";
import BarDistribution from "../components/charts/BarDistribution";

export default function SensorsPage() {
  const [sensors, setSensors] = React.useState([]);
  const [dist, setDist] = React.useState([]);

  React.useEffect(() => {
    const s = getMockSensors();
    setSensors(s);
    // build dummy distribution buckets from sensor values
    const buckets = ["Low", "Med", "High", "Very High"];
    const values = s.map(v => Number(v.value || 0));
    const min = Math.min(...values), max = Math.max(...values);
    const step = (max - min) / buckets.length || 1;
    const counts = buckets.map((b, i) => ({ bucket: b, count: 0 }));
    values.forEach(val => {
      const idx = Math.min(buckets.length - 1, Math.max(0, Math.floor((val - min) / step)));
      counts[idx].count += 1;
    });
    setDist(counts);
  }, []);

  const badge = (s) =>
    s === "ok"
      ? "bg-green-100 text-green-700"
      : s === "warn"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Sensors</h2>
        <p className="text-sm text-slate-600">Live inventory of field sensors and current readings.</p>
      </div>

      {/* Sensor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sensors.map((s) => (
          <div key={s.id} className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">{s.name}</div>
              <span className={`text-xs px-2 py-1 rounded ${badge(s.status)}`}>{s.status.toUpperCase()}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">{s.location}</div>
            <div className="mt-3 text-4xl font-extrabold tracking-tight">
              {s.value} <span className="text-sm text-slate-500">{s.unit}</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">Updated: {new Date(s.updatedAt).toLocaleTimeString()}</div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1.5 border border-slate-200 rounded-full text-xs hover:bg-slate-50">Calibrate</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-full text-xs hover:bg-slate-50">History</button>
            </div>
          </div>
        ))}
      </div>

      {/* KPI band */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{label:"Total Sensors",value:sensors.length||0},{label:"OK Status",value:sensors.filter(x=>x.status==='ok').length},{label:"Warnings",value:sensors.filter(x=>x.status==='warn').length}].map(k=> (
          <div key={k.label} className="rounded-2xl border border-slate-200/70 bg-white shadow-md px-5 py-4">
            <div className="text-xs uppercase tracking-wide text-slate-600">{k.label}</div>
            <div className="mt-1 text-2xl font-bold tracking-tight">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Distribution chart to extend height */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
        <div className="mb-3">
          <div className="text-lg font-semibold">Reading Distribution</div>
          <div className="text-sm text-slate-600">Dummy buckets showing how sensor values group.</div>
        </div>
        <BarDistribution data={dist} color="#0ea5e9" label="count" />
      </div>
    </div>
  );
}
