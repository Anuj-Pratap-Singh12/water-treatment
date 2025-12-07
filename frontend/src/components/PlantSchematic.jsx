// src/components/PlantSchematic.jsx
import React from 'react'

export default function PlantSchematic(){
  return (
    <div className="w-full">
      <svg viewBox="0 0 560 220" className="w-full h-44">
        {/* Inlet tank */}
        <rect x="20" y="30" width="110" height="80" rx="8" fill="#eefbf9" stroke="#c7f0ec" />
        <text x="75" y="55" fontSize="12" textAnchor="middle" fill="#065f46">Inlet</text>

        {/* arrow */}
        <path d="M130 70 L180 70" stroke="#06b6d4" strokeWidth="4" markerEnd="url(#a)"/>

        {/* Primary */}
        <rect x="180" y="10" width="140" height="120" rx="10" fill="#f0f9ff" stroke="#cfeefc"/>
        <text x="250" y="60" fontSize="12" textAnchor="middle" fill="#0c4a6e">Primary Clarifier</text>

        <path d="M320 70 L380 70" stroke="#06b6d4" strokeWidth="4" markerEnd="url(#a)"/>

        {/* Secondary */}
        <rect x="380" y="30" width="140" height="80" rx="10" fill="#fff7ed" stroke="#ffe9d5"/>
        <text x="450" y="60" fontSize="12" textAnchor="middle" fill="#7c3f00">Aeration</text>

        {/* storage */}
        <circle cx="300" cy="160" r="30" fill="#eef9f6" stroke="#d9f3ee"/>
        <text x="300" y="165" fontSize="12" textAnchor="middle" fill="#065f46">Storage</text>

        <defs>
          <marker id="a" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#06b6d4" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
