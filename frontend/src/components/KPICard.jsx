// src/components/KPICard.jsx
import React from 'react'

export default function KPICard({ title, value, sub }) {
  return (
    <div className="glass-tile p-4 rounded-lg">
      <div className="text-sm text-muted">{title}</div>
      <div className="kpi-number mt-2">{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  )
}
