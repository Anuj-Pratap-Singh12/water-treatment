// src/components/ProcessFlow.jsx
import React from "react";

/**
 * Responsive, compact ProcessFlow
 * - smaller boxes, larger spacing control, responsive scaling via CSS
 * - props: selected, onSelect
 */
export default function ProcessFlow({ selected = null, onSelect = () => {} }) {
  // The viewBox width remains the same.
  const viewW = 1000;
  // Increased viewBox height significantly to provide ample vertical space
  const viewH = 300; 

  // centers on the horizontal axis (three boxes spaced evenly)
  const positions = {
    primary: 140,
    secondary: 500,
    tertiary: 860,
    // Adjusted y-position to center the flow within the larger viewH
    y: 120 
  };

  const sizes = {
    primary: { rx: 120, ry: 48 },
    secondary: { rx: 180, ry: 56 },
    tertiary: { rx: 150, ry: 52 }
  };

  const stageList = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "tertiary", label: "Tertiary" }
  ];

  const rightEdge = (cx, rx) => cx + rx;
  const leftEdge = (cx, rx) => cx - rx;
  const cy = positions.y; // vertical center of the flow

  // Arrow dimensions (kept consistent)
  const arrowH = 50; 	
  const arrowHeadH = 60; 
  const arrowHeadL = 14; 

  // Function to generate the custom arrow path
  const getArrowPath = (startX, endX) => {
    // Points for a custom, solid-filled arrow shape (trapezoid body + triangle head)
    const M = `M ${startX} ${cy - arrowH / 2}`; 
    const L1 = `L ${endX - arrowHeadL} ${cy - arrowH / 2}`; 
    const L2 = `L ${endX - arrowHeadL} ${cy - arrowHeadH / 2}`; 
    const L3 = `L ${endX} ${cy}`; 
    const L4 = `L ${endX - arrowHeadL} ${cy + arrowHeadH / 2}`; 
    const L5 = `L ${endX - arrowHeadL} ${cy + arrowH / 2}`; 
    const L6 = `L ${startX} ${cy + arrowH / 2}`; 

    return `${M} ${L1} ${L2} ${L3} ${L4} ${L5} ${L6} Z`;
  };

  const isActive = (k) => selected === k;

  return (
    <div className="process-wrapper w-full">
      <div className="glass-card p-4 rounded-xl">
        <svg
          className="process-svg"
          viewBox={`0 0 ${viewW} ${viewH}`} 
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          style={{ minHeight: '200px' }} 
        >
          <defs>
            <linearGradient id="gPrimary" x1="0" x2="1">
              <stop offset="0" stopColor="#E6FBF8" />
              <stop offset="1" stopColor="#DFF7F4" />
            </linearGradient>
            <linearGradient id="gSecondary" x1="0" x2="1">
              <stop offset="0" stopColor="#EEF8FD" />
              <stop offset="1" stopColor="#E8F4FA" />
            </linearGradient>
            <linearGradient id="gTertiary" x1="0" x2="1">
              <stop offset="0" stopColor="#FFF9F0" />
              <stop offset="1" stopColor="#FFF6EA" />
            </linearGradient>

            <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(15,17,26,0.05)" />
            </filter>
          </defs>

          {/* connectors (solid, filled arrows) */}
          <path
            d={getArrowPath(
              rightEdge(positions.primary, sizes.primary.rx),
              leftEdge(positions.secondary, sizes.secondary.rx)
            )}
            fill="#06b6d4"
          />

          <path
            d={getArrowPath(
              rightEdge(positions.secondary, sizes.secondary.rx),
              leftEdge(positions.tertiary, sizes.tertiary.rx)
            )}
            fill="#06b6d4"
          />

          {/* Stage boxes */}
          {stageList.map((st) => {
            const cx = positions[st.key];
            const { rx, ry } = sizes[st.key];
            const active = isActive(st.key);
            const strokeColor = active ? "var(--primary)" : "rgba(6,182,212,0.12)";
            const textColor = active ? "var(--primary)" : "#0f172a";
            const fillId = st.key === "primary" ? "gPrimary" : st.key === "secondary" ? "gSecondary" : "gTertiary";

            return (
              <g key={st.key} transform={`translate(${cx}, ${positions.y})`} className="cursor-pointer" onClick={() => onSelect(st.key)}>
                <rect
                  x={-rx}
                  y={-ry}
                  rx="14"
                  ry="14"
                  width={rx * 2}
                  height={ry * 2}
                  fill={`url(#${fillId})`}
                  stroke={strokeColor}
                  strokeWidth={active ? 2.4 : 1}
                  filter="url(#softShadow)"
                  style={{ transition: "transform .22s ease, stroke-width .18s ease" }}
                />
                <text
                  x="0"
                  // FIX 1: Adjust y-position from 6 to 8 for better vertical centering 
                  y="8"
                  textAnchor="middle"
                  style={{
                    // FIX 2: Adjust font size from 22 to 20 to match the visual better
                    fontSize: 20, 
                    fontWeight: 700,
                    fill: textColor,
                    pointerEvents: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {st.label}
                </text>
              </g>
            );
          })}

          {/* Storage node (below) */}
          <g onClick={() => onSelect("storage")} className="cursor-pointer">
            <circle cx={positions.secondary} cy={positions.y + 100} r="36" fill="rgba(14,210,196,0.06)" stroke="rgba(6,182,212,0.12)" strokeWidth="2" />
            <text x={positions.secondary} y={positions.y + 104} textAnchor="middle" style={{ fill: "#06b6d4", fontWeight: 600, fontSize: 13 }}>
              Storage
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}