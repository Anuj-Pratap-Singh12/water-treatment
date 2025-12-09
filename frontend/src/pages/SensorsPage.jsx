// src/pages/SensorsPage.jsx
import React from "react";

export default function SensorsPage({ onLoadSensorData = () => {} }) {
  // Real sensor data
  const sensorData = [
    {
      id: "flow-rate",
      name: "Flow Rate",
      value: "16.69",
      unit: "m³/hr",
      stage: "Tertiary",
      status: "ok",
      updatedAt: new Date().toLocaleTimeString(),
    },
    {
      id: "ph",
      name: "pH",
      value: "7.43",
      unit: "",
      stage: "Tertiary",
      status: "ok",
      updatedAt: new Date().toLocaleTimeString(),
    },
    {
      id: "do",
      name: "Dissolved Oxygen",
      value: "0.95",
      unit: "mg/L",
      stage: "Tertiary",
      status: "warn",
      updatedAt: new Date().toLocaleTimeString(),
    },
    {
      id: "turbidity",
      name: "Turbidity",
      value: "2.55",
      unit: "NTU",
      stage: "Secondary",
      status: "ok",
      updatedAt: new Date().toLocaleTimeString(),
    },
    {
      id: "tds",
      name: "TDS",
      value: "844.21",
      unit: "ppm",
      stage: "Secondary",
      status: "ok",
      updatedAt: new Date().toLocaleTimeString(),
    },
    {
      id: "orp",
      name: "ORP",
      value: "227.12",
      unit: "mV",
      stage: "Secondary",
      status: "ok",
      updatedAt: new Date().toLocaleTimeString(),
    },
  ];

  const [sensors, setSensors] = React.useState(sensorData);

  const badge = (s) =>
    s === "ok"
      ? "bg-green-100 text-green-700"
      : s === "warn"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  // Function to load sensor data into influent quality
  const loadSensorDataToInfluent = () => {
    const influentData = {
      turbidity: parseFloat(sensors.find(s => s.id === "turbidity")?.value || 0),
      BOD: 0, // Sensors don't have BOD, will be estimated
      COD: 0, // Not provided by sensors
      TN: 0, // Not directly provided
      pH: parseFloat(sensors.find(s => s.id === "ph")?.value || 7),
      tds: parseFloat(sensors.find(s => s.id === "tds")?.value || 0),
      temperature: 25, // Default assumption
      heavyMetals: false,
      flow: parseFloat(sensors.find(s => s.id === "flow-rate")?.value || 0),
      totalVolume: 1000000, // Default
      dissolvedOxygen: parseFloat(sensors.find(s => s.id === "do")?.value || 0),
      orp: parseFloat(sensors.find(s => s.id === "orp")?.value || 0),
    };
    onLoadSensorData(influentData);
  };

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Sensors</h2>
            <p className="text-sm text-slate-600">Live inventory of field sensors and current readings.</p>
          </div>
          <button
            onClick={loadSensorDataToInfluent}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            Load to Influent Quality
          </button>
        </div>
      </div>

      {/* Sensor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sensors.map((s) => (
          <div key={s.id} className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">{s.name}</div>
                <div className="text-xs text-slate-500 mt-1">{s.stage}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${badge(s.status)}`}>
                {s.status.toUpperCase()}
              </span>
            </div>
            <div className="mt-4 text-4xl font-extrabold tracking-tight">
              {s.value} <span className="text-sm text-slate-500">{s.unit}</span>
            </div>
            <div className="mt-3 text-xs text-slate-500">Updated: {s.updatedAt}</div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1.5 border border-slate-200 rounded-full text-xs hover:bg-slate-50 transition">
                Calibrate
              </button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-full text-xs hover:bg-slate-50 transition">
                History
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* KPI band */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Sensors", value: sensors.length || 0 },
          { label: "OK Status", value: sensors.filter((x) => x.status === "ok").length },
          { label: "Warnings", value: sensors.filter((x) => x.status === "warn").length },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-200/70 bg-white shadow-md px-5 py-4">
            <div className="text-xs uppercase tracking-wide text-slate-600">{k.label}</div>
            <div className="mt-1 text-2xl font-bold tracking-tight">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Information box */}
      <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-r from-blue-50 to-emerald-50 shadow-md p-6">
        <div className="mb-3">
          <div className="text-lg font-semibold text-slate-900">Sensor Integration</div>
          <div className="text-sm text-slate-600 mt-1">
            The "Load to Influent Quality" button sends current sensor readings to the Process Design page.
            Use this to populate the influent water quality parameters based on real-time field measurements.
          </div>
        </div>
      </div>
    </div>
  );
}
