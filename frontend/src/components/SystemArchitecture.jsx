import React from 'react'
export default function SystemArchitecture(){
  return (
    <div className="rounded-xl glass-card p-6 shadow">
      <div className="text-sm text-gray-500">Architecture Diagram</div>
      <svg className="w-full mt-4" viewBox="0 0 1000 360" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="220" height="120" rx="10" fill="#f0fdfa" stroke="#ccfbf1"/>
        <text x="40" y="60" fontSize="14" fill="#065f46">Field: Sensors</text>
        <text x="40" y="80" fontSize="12" fill="#065f46">pH, Turbidity, Flow, Temp, DO</text>

        <rect x="280" y="30" width="220" height="120" rx="10" fill="#f8fafc" stroke="#e6f4f3"/>
        <text x="300" y="60" fontSize="14" fill="#0f766e">Edge Gateway</text>
        <text x="300" y="80" fontSize="12" fill="#0f766e">Filtering, Local Alerts, Actuation</text>

        <rect x="540" y="20" width="420" height="200" rx="10" fill="#ffffff" stroke="#e6f4f3"/>
        <text x="560" y="50" fontSize="14" fill="#075985">Cloud: Ingest, TSDB, ML, Rules</text>

        <line x1="240" y1="90" x2="280" y2="90" stroke="#06b6d4" strokeWidth="3" markerEnd="url(#arrow)" />
        <line x1="500" y1="90" x2="540" y2="90" stroke="#06b6d4" strokeWidth="3" markerEnd="url(#arrow)" />

        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#06b6d4" />
          </marker>
        </defs>

        <rect x="560" y="240" width="360" height="80" rx="8" fill="#f8fafc" stroke="#e6f4f3"/>
        <text x="580" y="270" fontSize="14" fill="#0f766e">Users: Dashboard, Mobile, Admin Console</text>
      </svg>

      <div className="mt-4 text-gray-500 text-sm">You can export this diagram as SVG for slides.</div>
    </div>
  )
}
