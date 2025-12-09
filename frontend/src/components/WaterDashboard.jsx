// src/components/WaterDashboard.jsx
import React from "react";

/**
 * WaterDashboard.jsx
 * Single-file, drop-in React component for "Smart Water Recovery & Reuse (ReLeaf)" dashboard.
 *
 * Usage: import WaterDashboard from "./components/WaterDashboard"; <WaterDashboard />
 *
 * Tailwind CSS utilities are used throughout. It also references .glass-card, .glass-tile
 * from your global CSS for the glassy card look (if present).
 */

/* ---------- Helper subcomponents (SVG sparklines, gauge) ---------- */

/** Simple inline sparkline: draws a small sparkline from an array of numbers */
function Sparkline({ data = [], width = 80, height = 28, stroke = "#06b6d4" }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
  // Optionally fill area
  const d = `M ${points.split(" ")[0]} ` + points.split(" ").slice(1).map(p => `L ${p}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`${d} L ${width} ${height} L 0 ${height} Z`} fill={`${stroke}20`} />
    </svg>
  );
}

/** Circular gauge showing percent with label and small ticks */
function CircularGauge({ value = 92, size = 160, strokeWidth = 12, color = "var(--accent)" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100);
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* background ring */}
      <defs>
        <linearGradient id="gaugeGradient" x1="0" x2="1">
          <stop offset="0" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle cx={center} cy={center} r={radius} stroke="rgba(15,17,26,0.06)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </g>
      {/* center text */}
      <text x="50%" y="46%" textAnchor="middle" className="text-sm" style={{ fill: "var(--muted)", fontSize: 12 }}>
        Reuse
      </text>
      <text x="50%" y="62%" textAnchor="middle" className="font-extrabold" style={{ fontSize: 28, fill: "var(--primary)" }}>
        {Math.round(value)}%
      </text>
    </svg>
  );
}

/* ---------- Main Dashboard component ---------- */

export default function WaterDashboard() {
  /**
   * MOCK DATA - replace with props/API calls in your app
   */
  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const waterStatus = {
    label: "Excellent",
    percent: 92,
    metrics: {
      BOD: { value: 3.6, unit: "mg/L" },
      pH: { value: "7.2 - 7.6", unit: "" },
      Turbidity: { value: 1.8, unit: "NTU" },
    },
    volume: { treated: 460, capacity: 500, unit: "m³" },
  };

  const processState = {
    flowRate: 820, // m3/h
    mode: "Auto",
    stageProgress: { primary: 100, secondary: 68, tertiary: 42 },
    alerts: 2,
  };

  const secondaryMetrics = {
    FlowRate: { val: 320, unit: "m³/h", spark: [280, 300, 310, 320, 330, 320, 318] },
    pH: { val: 6.8, unit: "", spark: [6.9, 6.85, 6.8, 6.82, 6.8, 6.78] },
    DO: { val: 2.6, unit: "mg/L", spark: [3.2, 3.0, 2.9, 2.8, 2.6, 2.5] }, // low -> highlight
    Turbidity: { val: 2.4, unit: "NTU", spark: [2.8, 2.6, 2.5, 2.4, 2.3] },
    TDS: { val: 450, unit: "mg/L", spark: [460, 455, 452, 450, 449] },
    ORP: { val: 210, unit: "mV", spark: [200, 205, 208, 210, 212] },
  };

  const tertiaryMetrics = {
    FlowRate: { val: 200, unit: "m³/h", spark: [190, 195, 198, 200, 202] },
    pH: { val: 7.4, unit: "", spark: [7.3, 7.35, 7.38, 7.4, 7.41] },
    BOD: { val: 1.2, unit: "mg/L", spark: [1.9, 1.6, 1.4, 1.3, 1.2] },
    Turbidity: { val: 0.9, unit: "NTU", spark: [1.2, 1.05, 1.0, 0.95, 0.9] },
    TDS: { val: 380, unit: "mg/L", spark: [385, 382, 381, 380] },
    Conductivity: { val: 510, unit: "μS/cm", spark: [520, 515, 512, 510] },
  };

  const controlStatus = {
    pump1: { running: true },
    aerator: { mode: "Auto" },
    chemicalLevel: 86, // %
  };

  /* ---------- small utility renderers ---------- */

  const MetricTile = ({ name, metric, highlight = false }) => {
    const accent = highlight ? "text-orange-500" : "text-sky-600";
    return (
      <div className="glass-tile p-4 rounded-xl flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted">{name}</div>
            <div className={`font-semibold text-lg ${accent}`}>
              {metric.val} <span className="text-sm text-muted">{metric.unit}</span>
            </div>
          </div>
          <div className="text-sm text-muted">{/* small placeholder for status icon */}</div>
        </div>
        <div className="mt-3">
          <Sparkline data={metric.spark} width={140} height={36} stroke={highlight ? "#fb923c" : "#06b6d4"} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Container */}
      <div className="max-w-[1320px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-3 bg-gradient-to-br from-sky-500 to-emerald-400 shadow-md">
              {/* simple droplet logo */}
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 12 7 12s7-6.75 7-12c0-3.87-3.13-7-7-7z" fill="#fff" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold">AquaSense</div>
              <div className="text-xs text-muted">Smart Water Recovery & Reuse</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted">{timeLabel}</div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white shadow-sm">
              <img src="https://avatars.dicebear.com/api/initials/AD.svg" alt="user" className="w-8 h-8 rounded-full" />
              <div className="text-sm">Admin</div>
            </div>
          </div>
        </header>

        {/* Top summary & controls grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Water Quality + Gauge */}
          <div className="lg:col-span-1 glass-card p-6 rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted">Water Quality Status</div>
                <div className="mt-2 text-xl font-bold">{waterStatus.label}</div>
              </div>
              <div>
                <CircularGauge value={waterStatus.percent} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted">BOD</div>
                <div className="font-medium">{waterStatus.metrics.BOD.value} {waterStatus.metrics.BOD.unit}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted">pH</div>
                <div className="font-medium">{waterStatus.metrics.pH.value}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted">Turbidity</div>
                <div className="font-medium">{waterStatus.metrics.Turbidity.value} {waterStatus.metrics.Turbidity.unit}</div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-white/60 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">Reuse Efficiency</div>
                  <div className="font-bold text-2xl">{waterStatus.percent}%</div>
                  <div className="text-xs text-muted mt-1">{waterStatus.volume.treated} / {waterStatus.volume.capacity} {waterStatus.volume.unit}</div>
                </div>
                <div style={{ width: 110 }}>
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${(waterStatus.volume.treated / waterStatus.volume.capacity) * 100}%` }} className="h-4 bg-gradient-to-r from-sky-400 to-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Process Stage Overview */}
          <div className="lg:col-span-1 glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">Process Flow</div>
                  <div className="text-lg font-semibold">Primary → Secondary → Tertiary</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted">Mode</div>
                  <div className="font-semibold">{processState.mode}</div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {/* Stage progress indicators */}
                <div>
                  <div className="flex justify-between text-xs text-muted">
                    <div>Primary</div>
                    <div>{processState.stageProgress.primary}%</div>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full mt-1">
                    <div style={{ width: `${processState.stageProgress.primary}%` }} className="h-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted">
                    <div>Secondary</div>
                    <div>{processState.stageProgress.secondary}%</div>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full mt-1">
                    <div style={{ width: `${processState.stageProgress.secondary}%` }} className="h-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted">
                    <div>Tertiary</div>
                    <div>{processState.stageProgress.tertiary}%</div>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full mt-1">
                    <div style={{ width: `${processState.stageProgress.tertiary}%` }} className="h-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">
                <div className="text-xs text-muted">Flow Rate</div>
                <div className="font-semibold">{processState.flowRate} m³/h</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-muted">Alerts</div>
                <div className="font-bold text-red-600">{processState.alerts} Active</div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 btn-primary py-2 rounded-xl">Start Process</button>
              <button className="flex-1 btn-outline py-2 rounded-xl">Stop Process</button>
            </div>
          </div>

          {/* Right: Alerts & Quick Actions */}
          <div className="lg:col-span-1 glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted">System Alerts</div>
                <div className="text-xl font-semibold">{processState.alerts} Alerts Active</div>
              </div>
              <div>
                <button className="px-3 py-2 rounded-lg bg-red-50 text-red-600">View</button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-muted">Quick Actions</div>
              <div className="mt-3 space-y-2">
                <button className="w-full btn-outline py-2 rounded-md text-left">Acknowledge Alerts</button>
                <button className="w-full btn-outline py-2 rounded-md text-left">Export Logs</button>
                <button className="w-full btn-outline py-2 rounded-md text-left">Run Diagnostics</button>
              </div>
            </div>
          </div>
        </div>

        {/* Live monitoring stage cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Secondary Stage */}
          <section className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted">Live Monitoring</div>
                <div className="text-xl font-semibold">Secondary Stage</div>
                <div className="text-sm text-muted mt-1">Realtime metrics & sparklines</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-muted">Updated</div>
                <div className="font-medium">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(secondaryMetrics).map(([k, v]) => (
                <MetricTile key={k} name={k.replace(/([A-Z])/g, " $1").trim()} metric={{ val: v.val, unit: v.unit, spark: v.spark }} highlight={k === "DO" && v.val < 3.0} />
              ))}
            </div>
          </section>

          {/* Tertiary Stage */}
          <section className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted">Live Monitoring</div>
                <div className="text-xl font-semibold">Tertiary Stage</div>
                <div className="text-sm text-muted mt-1">Polishing & advanced removal</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-muted">Updated</div>
                <div className="font-medium">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(tertiaryMetrics).map(([k, v]) => (
                <MetricTile key={k} name={k.replace(/([A-Z])/g, " $1").trim()} metric={{ val: v.val, unit: v.unit, spark: v.spark }} />
              ))}
            </div>
          </section>
        </div>

        {/* Control panel schematic */}
        <section className="glass-card p-6 rounded-2xl">
          <div className="flex items-start justify-between gap-6">
            {/* Schematic (left) */}
            <div className="flex-1">
              <div className="text-xs text-muted">System Schematic</div>
              <div className="text-lg font-semibold">Plant Controls</div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-white/60 border">
                  <div className="flex items-center gap-3">
                    <svg width="34" height="34" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" fill="#06b6d4"/></svg>
                    <div>
                      <div className="text-sm font-medium">Raw Tank</div>
                      <div className="text-xs text-muted">Level: 78%</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/60 border">
                  <div className="flex items-center gap-3">
                    <svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="9" r="6" fill="#60a5fa"/></svg>
                    <div>
                      <div className="text-sm font-medium">Clarifier</div>
                      <div className="text-xs text-muted">Status: Optimal</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/60 border">
                  <div className="flex items-center gap-3">
                    <svg width="34" height="34" viewBox="0 0 24 24"><path d="M6 3h12v6H6z" fill="#34d399"/></svg>
                    <div>
                      <div className="text-sm font-medium">Dosing System</div>
                      <div className="text-xs text-muted">Chemicals OK</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/60 border">
                  <div className="flex items-center gap-3">
                    <svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 12h14v6H5z" fill="#fb923c"/></svg>
                    <div>
                      <div className="text-sm font-medium">Outlet Pump</div>
                      <div className="text-xs text-muted">Running</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* visual schematic line */}
              <div className="mt-6 p-4 rounded-lg bg-white/40 border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-sky-100 flex items-center justify-center">T1</div>
                  <div className="w-12 h-12 rounded bg-emerald-100 flex items-center justify-center">A</div>
                  <div className="w-12 h-12 rounded bg-yellow-100 flex items-center justify-center">P</div>
                </div>
                <div className="text-sm text-muted">Schematic simplified for UI</div>
              </div>
            </div>

            {/* Controls (right) */}
            <aside className="w-[320px] space-y-4">
              <div className="p-4 rounded-xl bg-white/60 border">
                <div className="text-sm text-muted">Pump 1</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-semibold">Running</div>
                  <div>
                    <button className={`px-3 py-1 rounded-md ${controlStatus.pump1.running ? "bg-red-100 text-red-600" : "bg-slate-100"}`}>Stop</button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/60 border">
                <div className="text-sm text-muted">Aerator</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-semibold">{controlStatus.aerator.mode}</div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-md bg-slate-100">Manual</button>
                    <button className="px-3 py-1 rounded-md bg-sky-100">Auto</button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/60 border">
                <div className="text-sm text-muted">Chemical Level</div>
                <div className="mt-2">
                  <div className="text-lg font-semibold">{controlStatus.chemicalLevel}%</div>
                  <div className="mt-2 h-3 bg-slate-200 rounded overflow-hidden">
                    <div style={{ width: `${controlStatus.chemicalLevel}%` }} className="h-3 bg-gradient-to-r from-sky-400 to-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/60 border">
                <div className="text-sm text-muted">Quick Control</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="py-2 rounded-md btn-primary">Start Pump</button>
                  <button className="py-2 rounded-md btn-outline">Stop Pump</button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Footer small */}
        <footer className="text-center text-xs text-muted py-4">
          © {new Date().getFullYear()} AquaSense · Smart Water Recovery & Reuse
        </footer>
      </div>
    </div>
  );
}
