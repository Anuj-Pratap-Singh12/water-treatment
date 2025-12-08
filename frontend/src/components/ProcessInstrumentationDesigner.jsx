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
    { id: "intake", label: "Intake", x: 80, y: 150, type: "pump" },
    { id: "coagulation", label: "Coagulation", x: 200, y: 150, type: "tank" },
    { id: "sedimentation", label: "Sedimentation", x: 320, y: 150, type: "clarifier" },
    { id: "filtration", label: "Filtration", x: 440, y: 150, type: "filter" },
    { id: "storage", label: "Storage", x: 560, y: 150, type: "tank" },
  ];

  // Instruments mapped to locations
  const instruments = [
    { id: "FT-101", label: "FT-101", unit: "Flow", x: 130, y: 80, value: `${flow.toFixed(1)} m³/h` },
    { id: "PH-401", label: "PH-401", unit: "pH", x: 270, y: 80, value: `${ph.toFixed(1)}` },
    { id: "P-101", label: "P-101", unit: "Pump", x: 80, y: 200, value: pumpOn ? "ON" : "OFF" },
    { id: "V-301", label: "V-301", unit: "Valve", x: 440, y: 200, value: valveOpen ? "OPEN" : "CLOSED" },
    { id: "LT-301", label: "LT-301", unit: "Tank Level", x: 560, y: 80, value: `${tankLevel}%` },
  ];

  // Render unit operation symbol
  const renderUnit = (unit) => {
    const isActive = pumpOn && valveOpen;
    const color = isActive ? "#10b981" : "#e0f2fe";
    const stroke = isActive ? "#059669" : "#0284c7";

    if (unit.type === "pump") {
      return (
        <g key={unit.id}>
          <circle
            cx={unit.x}
            cy={unit.y}
            r="20"
            fill={color}
            stroke={stroke}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setPumpOn(!pumpOn);
              onNodeClick(unit.id);
            }}
          />
          <text x={unit.x} y={unit.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill="#1e293b">
            P
          </text>
        </g>
      );
    } else if (unit.type === "tank") {
      return (
        <g key={unit.id}>
          <ellipse cx={unit.x} cy={unit.y - 12} rx="18" ry="10" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" />
          <rect x={unit.x - 18} y={unit.y - 12} width="36" height="28" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
          <ellipse cx={unit.x} cy={unit.y + 16} rx="18" ry="10" fill="#6366f1" stroke="#6366f1" strokeWidth="2" />
          <text x={unit.x} y={unit.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#1e293b">
            {unit.label.split(" ")[0]}
          </text>
        </g>
      );
    } else if (unit.type === "clarifier") {
      return (
        <g key={unit.id}>
          <circle cx={unit.x} cy={unit.y} r="18" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" className="cursor-pointer hover:opacity-80" onClick={() => onNodeClick(unit.id)} />
          <text x={unit.x} y={unit.y - 5} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">
            {unit.label}
          </text>
        </g>
      );
    } else if (unit.type === "filter") {
      return (
        <g key={unit.id}>
          <rect x={unit.x - 15} y={unit.y - 15} width="30" height="30" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" rx="3" className="cursor-pointer hover:opacity-80" onClick={() => onNodeClick(unit.id)} />
          <text x={unit.x} y={unit.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#1e293b">
            F
          </text>
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
            x1={from.x + 20}
            y1={from.y}
            x2={to.x - 20}
            y2={to.y}
            stroke={pumpOn && valveOpen ? "#10b981" : "#cbd5e1"}
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
            className="transition-all"
          />
          <polygon points={`${to.x - 15},${to.y} ${to.x - 10},${to.y - 3} ${to.x - 10},${to.y + 3}`} fill={pumpOn && valveOpen ? "#10b981" : "#cbd5e1"} />
        </g>
      );
    }
    return pipes;
  };

  // Render instruments
  const renderInstruments = () => {
    return instruments.map((inst) => (
      <g key={inst.id}>
        <rect
          x={inst.x - 30}
          y={inst.y - 20}
          width="60"
          height="40"
          fill="#f1f5f9"
          stroke="#475569"
          strokeWidth="1.5"
          rx="4"
          className="cursor-pointer hover:fill-slate-100 transition-colors"
          onClick={() => onNodeClick(inst.id)}
        />
        <text x={inst.x} y={inst.y - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b">
          {inst.label}
        </text>
        <text x={inst.x} y={inst.y + 4} textAnchor="middle" fontSize="10" fill="#475569">
          {inst.value}
        </text>
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
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 overflow-x-auto">
        <svg width="700" height="300" className="min-w-max">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#475569" />
            </marker>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="700" height="300" fill="url(#grid)" />

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