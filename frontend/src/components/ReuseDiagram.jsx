import React from "react";

export default function ReuseDiagram() {
  return (
    <svg viewBox="0 0 400 250" className="w-full h-64">
      {/* Pipes and flow */}
      <rect x="50" y="50" width="100" height="20" rx="10" fill="#06b6d4" />
      <rect x="150" y="50" width="20" height="100" rx="10" fill="#06b6d4" />
      <rect x="150" y="150" width="200" height="20" rx="10" fill="#06b6d4" />

      {/* Nodes / Tanks */}
      <circle cx="50" cy="60" r="15" fill="#fbbf24" />
      <text x="50" y="65" textAnchor="middle" fill="#000" fontSize="10">
        Primary
      </text>

      <circle cx="160" cy="160" r="15" fill="#34d399" />
      <text x="160" y="165" textAnchor="middle" fill="#000" fontSize="10">
        Secondary
      </text>

      <circle cx="340" cy="160" r="15" fill="#60a5fa" />
      <text x="340" y="165" textAnchor="middle" fill="#000" fontSize="10">
        Tertiary
      </text>

      {/* Flow arrows */}
      <polygon points="145,50 150,55 150,45" fill="#fff" />
      <polygon points="340,150 335,155 335,145" fill="#fff" />

      {/* Labels */}
      <text x="100" y="45" fill="#fff" fontSize="12">
        Flow: 2.2 m³/hr
      </text>
      <text x="250" y="145" fill="#fff" fontSize="12">
        Reuse Efficiency: 92%
      </text>
    </svg>
  );
}
