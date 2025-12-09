import React, { useState } from "react";

/**
 * ProcessInstrumentationDesigner
 * Interactive SVG-based P&ID with:
 * - Unit operations (intake, coagulation, sedimentation, filtration, storage)
 * - Instruments (flow meter FT-101, pH sensor PH-401, pump P-101, valve V-301, level transmitter LT-301)
 * - Real-time parameter controls (flow, turbidity, TDS, pH)
 * - Equipment state controls (pump on/off, valve open/closed, tank level)
 */
export default function ProcessInstrumentationDesigner({
  influent = null,
  localResults = null,
  onNodeClick = () => {},
}) {
  // Instrument states
  const [pumpOn, setPumpOn] = useState(false);
  const [valveOpen, setValveOpen] = useState(true);
  const [tankLevel, setTankLevel] = useState(60);
  
  // Parameter overrides
  const [flow, setFlow] = useState(influent?.flow || 100);
  const [turbidity, setTurbidity] = useState(influent?.turbidity || 50);
  const [tds, setTds] = useState(influent?.tds || 500);
  const [ph, setPh] = useState(influent?.pH || 7.0);

  // Unit operations
  const units = [
    { id: "intake", label: "Intake", x: 150, y: 250, type: "pump" },
    { id: "coagulation", label: "Coagulation", x: 350, y: 250, type: "tank" },
    { id: "sedimentation", label: "Sedimentation", x: 550, y: 250, type: "clarifier" },
    { id: "filtration", label: "Filtration", x: 750, y: 250, type: "filter" },
    { id: "storage", label: "Storage", x: 950, y: 250, type: "tank" },
  ];

  const flowActive = pumpOn && valveOpen;

  // Instruments mapped to locations
  const instruments = [
    { id: "FT-101", label: "FT-101", unit: "Flow", x: 220, y: 120, value: `${flow.toFixed(1)} m³/h` },
    { id: "PH-401", label: "PH-401", unit: "pH", x: 470, y: 120, value: `${ph.toFixed(1)}` },
    { id: "P-101", label: "P-101", unit: "Pump", x: 150, y: 350, value: pumpOn ? "ON" : "OFF" },
    { id: "V-301", label: "V-301", unit: "Valve", x: 750, y: 350, value: valveOpen ? "OPEN" : "CLOSED" },
    { id: "LT-301", label: "LT-301", unit: "Tank Level", x: 950, y: 120, value: `${tankLevel}%` },
  ];

  // Render unit operation symbol
  const renderUnit = (unit) => {
    const isActive = pumpOn && valveOpen;
    const color = isActive ? "#10b981" : "#e0f2fe";
    const stroke = isActive ? "#059669" : "#0284c7";

    if (unit.type === "pump") {
      return (
        <g key={unit.id}>
          <g transform={`translate(${unit.x}, ${unit.y})`} className="cursor-pointer" onClick={() => { setPumpOn(!pumpOn); onNodeClick(unit.id); }}>
            <circle r="26" fill="url(#pipeGradient)" stroke="#065f46" strokeWidth="2" filter="url(#shadow)" />
            {/* pump rotor */}
            <g className={pumpOn ? 'pump-spin' : ''}>
              <rect x={-3} y={-14} width={6} height={28} rx="2" fill="#fde68a" />
              <rect x={-14} y={-3} width={28} height={6} rx="2" fill="#fde68a" />
            </g>
          </g>
          <text x={unit.x} y={unit.y + 36} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0f172a">P-101</text>
        </g>
      );
    } else if (unit.type === "tank") {
      return (
        <g key={unit.id}>
          <g filter="url(#shadow)">
            <rect x={unit.x - 42} y={unit.y - 36} width="84" height="72" rx="10" fill="#eef2ff" stroke="#6366f1" strokeWidth="2" />
            <rect x={unit.x - 36} y={unit.y - 28} width="72" height="56" rx="8" fill="#fff" />
          </g>
          <text x={unit.x} y={unit.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#0f172a">
            {unit.label}
          </text>
          <title>{unit.label} — Click to open</title>
        </g>
      );
    } else if (unit.type === "clarifier") {
      return (
        <g key={unit.id}>
          <g filter="url(#shadow)" className="cursor-pointer" onClick={() => onNodeClick(unit.id)}>
            <circle cx={unit.x} cy={unit.y} r="34" fill="#fff7ed" stroke="#fb923c" strokeWidth="2" />
            <circle cx={unit.x} cy={unit.y} r="20" fill="#fff" />
          </g>
          <text x={unit.x} y={unit.y - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">
            {unit.label}
          </text>
          <title>{unit.label} — Settling Tank</title>
        </g>
      );
    } else if (unit.type === "filter") {
      return (
        <g key={unit.id}>
          <g filter="url(#shadow)" className="cursor-pointer" onClick={() => onNodeClick(unit.id)}>
            <rect x={unit.x - 36} y={unit.y - 28} width="72" height="56" rx="8" fill="#fff1f2" stroke="#ef4444" strokeWidth="2" />
            {/* filter media lines */}
            <g stroke="#ef4444" strokeWidth="2">
              <line x1={unit.x - 24} y1={unit.y - 12} x2={unit.x + 24} y2={unit.y - 12} />
              <line x1={unit.x - 24} y1={unit.y} x2={unit.x + 24} y2={unit.y} />
              <line x1={unit.x - 24} y1={unit.y + 12} x2={unit.x + 24} y2={unit.y + 12} />
            </g>
          </g>
          <text x={unit.x} y={unit.y + 30} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="700" fill="#0f172a">
            {unit.label}
          </text>
          <title>{unit.label} — Filtration Unit</title>
        </g>
      );
    }
  };

  // Render connecting pipes
  const renderPipes = () => {
    const pipes = [];
    for (let i = 0; i < units.length - 1; i++) {
      const from = units[i];
      const to = units[i + 1];
      pipes.push(
        <g key={`pipe-${i}`}>
          <line
            x1={from.x + 36}
            y1={from.y}
            x2={to.x - 36}
            y2={to.y}
            stroke={flowActive ? 'url(#pipeGradient)' : '#cbd5e1'}
            strokeWidth="6"
            markerEnd={`url(#${flowActive ? 'arrowActive' : 'arrowInactive'})`}
            className={flowActive ? 'flow-anim' : 'transition-all'}
            strokeLinecap="round"
          />
          {/* subtle arrow head */}
          <polygon points={`${to.x - 20},${to.y} ${to.x - 12},${to.y - 6} ${to.x - 12},${to.y + 6}`} fill={flowActive ? '#059669' : '#94a3b8'} opacity="0.9" />
        </g>
      );
    }
    return pipes;
  };

  // Render instruments
  const renderInstruments = () => {
    return instruments.map((inst) => (
      <g key={inst.id}>
        <g filter="url(#shadow)" className="cursor-pointer" onClick={() => onNodeClick(inst.id)}>
          <rect
            x={inst.x - 54}
            y={inst.y - 34}
            width="108"
            height="68"
            fill="#ffffff"
            stroke="#e6eef7"
            strokeWidth="1"
            rx="8"
          />
        </g>
        <text x={inst.x - 28} y={inst.y - 4} textAnchor="start" fontSize="12" fontWeight="700" fill="#0f172a">
          {inst.label}
        </text>
        <text x={inst.x - 28} y={inst.y + 12} textAnchor="start" fontSize="11" fill="#475569">
          {inst.unit}: {inst.value}
        </text>

        {/* Special rendering for valve to show lever */}
        {inst.id === 'V-301' && (
          <g transform={`translate(${inst.x + 22}, ${inst.y})`}>
            <rect x={-18} y={-6} width={36} height={12} rx={3} fill={valveOpen ? '#38bdf8' : '#cbd5e1'} stroke="#0f172a" strokeWidth="0.8" />
            <rect x={-2} y={-10} width={4} height={20} rx={2} fill="#0f172a" className={valveOpen ? 'valve-open' : 'valve-closed'} />
            <title>Valve V-301 — {valveOpen ? 'Open' : 'Closed'}</title>
          </g>
        )}
      </g>
    ));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Process & Instrumentation Designer</div>
        <div className="text-sm text-slate-600">Interactive P&ID with real-time parameter controls and instrument states</div>
      </div>

      {/* SVG Diagram */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 overflow-x-auto">
        <svg width="1200" height="500" className="min-w-max">
          <defs>
            <linearGradient id="pipeGradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <marker id="arrowActive" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#059669" />
            </marker>
            <marker id="arrowInactive" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
            </marker>

            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
            </filter>

            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1200" height="500" fill="url(#grid)" />

          <style>{`
            .flow-anim { stroke-dasharray: 8 6; animation: dash 1.2s linear infinite; }
            @keyframes dash { to { stroke-dashoffset: -14; } }
            .pump-spin { transform-origin: center; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .valve-closed { transform-origin: center; transition: transform 300ms ease; }
            .valve-open { transform-origin: center; transition: transform 300ms ease; transform: rotate(90deg); }
          `}</style>

          {/* Pipes */}
          {renderPipes()}

          {/* Unit operations */}
          {units.map((unit) => renderUnit(unit))}

          {/* Instruments */}
          {renderInstruments()}
        </svg>
      </div>

      {/* Control Panel */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-4">
        <div className="text-xs font-semibold text-slate-600 uppercase">Parameter Controls</div>

        {/* Row 1: Flow, Turbidity, TDS */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700">Flow Rate (m³/h)</label>
            <input
              type="range"
              min="10"
              max="500"
              value={flow}
              onChange={(e) => setFlow(Number(e.target.value))}
              className="w-full mt-1 accent-emerald-600"
            />
            <div className="text-xs text-slate-600 mt-1">{flow.toFixed(1)}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Turbidity (NTU)</label>
            <input
              type="range"
              min="0"
              max="200"
              value={turbidity}
              onChange={(e) => setTurbidity(Number(e.target.value))}
              className="w-full mt-1 accent-emerald-600"
            />
            <div className="text-xs text-slate-600 mt-1">{turbidity.toFixed(1)}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">TDS (mg/L)</label>
            <input
              type="range"
              min="100"
              max="2000"
              value={tds}
              onChange={(e) => setTds(Number(e.target.value))}
              className="w-full mt-1 accent-emerald-600"
            />
            <div className="text-xs text-slate-600 mt-1">{tds.toFixed(0)}</div>
          </div>
        </div>

        {/* Row 2: pH, Equipment States */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700">pH</label>
            <input
              type="range"
              min="1"
              max="14"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(Number(e.target.value))}
              className="w-full mt-1 accent-emerald-600"
            />
            <div className="text-xs text-slate-600 mt-1">{ph.toFixed(1)}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Pump P-101</label>
            <button
              onClick={() => setPumpOn(!pumpOn)}
              className={`w-full mt-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                pumpOn
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-slate-300 text-slate-700 hover:bg-slate-400"
              }`}
            >
              {pumpOn ? "ON" : "OFF"}
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Valve V-301</label>
            <button
              onClick={() => setValveOpen(!valveOpen)}
              className={`w-full mt-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                valveOpen
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-300 text-slate-700 hover:bg-slate-400"
              }`}
            >
              {valveOpen ? "OPEN" : "CLOSED"}
            </button>
          </div>
        </div>

        {/* Tank Level */}
        <div>
          <label className="text-xs font-medium text-slate-700">Storage Tank Level (LT-301)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={tankLevel}
            onChange={(e) => setTankLevel(Number(e.target.value))}
            className="w-full mt-1 accent-purple-600"
          />
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 transition-all"
                style={{ width: `${tankLevel}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 min-w-fit">{tankLevel}%</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
        <strong>Live Parameters:</strong> Flow {flow.toFixed(1)} m³/h | Turbidity {turbidity.toFixed(1)} NTU | TDS {tds.toFixed(0)} mg/L | pH {ph.toFixed(1)} | Pump {pumpOn ? "ON" : "OFF"} | Valve {valveOpen ? "OPEN" : "CLOSED"} | Tank {tankLevel}%
      </div>
    </div>
  );
}