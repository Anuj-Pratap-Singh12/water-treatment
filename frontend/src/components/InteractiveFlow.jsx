// src/components/InteractiveFlow.jsx
import React, { useState, useEffect } from "react";

// Mini Sparkline component
function Sparkline({ data = [], color = "#fff" }) {
  const max = Math.max(...data, 1);
  return (
    <svg className="w-full h-10" viewBox="0 0 100 20" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={data.map((v, i) => `${(i / (data.length - 1)) * 100},${20 - (v / max) * 18}`).join(" ")}
      />
    </svg>
  );
}

// Define stages
const stages = [
  { id: "primary", name: "Primary Treatment", color: "#06B6D4" },
  { id: "secondary", name: "Secondary Treatment", color: "#3B82F6" },
  { id: "tertiary", name: "Tertiary Treatment", color: "#10B981" },
  { id: "reuse", name: "Reuse", color: "#F59E0B" },
];

// Mock function to generate random metrics
const getRandomMetrics = () => ({
  flow: Array.from({ length: 10 }, () => (Math.random() * 5 + 2).toFixed(1)),
  turbidity: Array.from({ length: 10 }, () => (Math.random() * 5).toFixed(1)),
  BOD: Array.from({ length: 10 }, () => (Math.random() * 10 + 5).toFixed(1)),
  pH: Array.from({ length: 10 }, () => (Math.random() * 0.5 + 6.8).toFixed(1)),
});

export default function InteractiveFlow() {
  const [hovered, setHovered] = useState(null);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    // Initialize metrics
    const initial = {};
    stages.forEach(stage => {
      initial[stage.id] = getRandomMetrics();
    });
    setMetrics(initial);

    // Update metrics every 3 seconds
    const interval = setInterval(() => {
      const updated = {};
      stages.forEach(stage => {
        updated[stage.id] = getRandomMetrics();
      });
      setMetrics(updated);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
      {stages.map((stage, index) => (
        <div
          key={stage.id}
          className={`relative flex-1 p-6 rounded-xl cursor-pointer transition-transform duration-300 ${
            hovered === stage.id ? "scale-105 shadow-2xl" : "shadow-md"
          }`}
          style={{ backgroundColor: stage.color }}
          onMouseEnter={() => setHovered(stage.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="text-white font-bold text-lg">{stage.name}</div>

          {metrics[stage.id] && (
            <div className="mt-3 space-y-2 text-white text-sm">
              <div>
                Flow: {metrics[stage.id].flow[metrics[stage.id].flow.length - 1]} m³/hr
                <Sparkline data={metrics[stage.id].flow} color="#fff" />
              </div>
              <div>
                Turbidity: {metrics[stage.id].turbidity[metrics[stage.id].turbidity.length - 1]} NTU
                <Sparkline data={metrics[stage.id].turbidity} color="#fff" />
              </div>
              <div>
                BOD: {metrics[stage.id].BOD[metrics[stage.id].BOD.length - 1]} mg/L
                <Sparkline data={metrics[stage.id].BOD} color="#fff" />
              </div>
              <div>
                pH: {metrics[stage.id].pH[metrics[stage.id].pH.length - 1]}
                <Sparkline data={metrics[stage.id].pH} color="#fff" />
              </div>
            </div>
          )}

          {hovered === stage.id && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 rounded-lg bg-white text-black shadow-lg text-sm">
              Detailed metrics for {stage.name}
            </div>
          )}

          {index < stages.length - 1 && (
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-1 bg-white rounded-full hidden md:block"></div>
          )}
        </div>
      ))}
    </div>
  );
}
