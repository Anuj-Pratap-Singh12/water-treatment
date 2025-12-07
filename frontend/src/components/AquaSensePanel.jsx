// src/components/AquaSensePanel.jsx
import React from 'react'
import { motion } from 'framer-motion'
import PlantSchematic from './PlantSchematic'
import KPICard from './KPICard'

export default function AquaSensePanel({ alerts = [] }){
  // demo numbers (replace with API data as needed)
  const reusePercent = 92
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="rounded-full p-1" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" fill="#06B6D4"></path>
            </svg>
            <div>
              <div className="text-2xl font-semibold">AquaSense</div>
              <div className="text-sm text-muted">Smart Water Recovery & Reuse</div>
            </div>
          </div>
          <div className="text-sm text-muted mt-4">Water Qualifyance <span className="ml-2 text-xs text-gray-400">8/2/am, 2023</span></div>
        </div>

        <div className="text-sm text-muted">Last updated: 9:41</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left card: status */}
        <div className="col-span-2 glass-card p-6 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24"><path d="M20.285 6.708L9 18l-5.285-5.292 1.414-1.414L9 15.172 18.871 5.294z" fill="#059669"/></svg>
            </div>
            <div>
              <div className="text-sm text-muted">Water Quality Status</div>
              <div className="text-xl font-semibold text-green-700 mt-1">Excellent</div>

              <div className="mt-3 text-sm text-muted">
                <div>BOD: <span className="font-medium">8 mg/L</span></div>
                <div>pH: <span className="font-medium">7 - 7.1</span></div>
                <div>Turbidity: <span className="font-medium">2 NTU</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: reuse efficiency / alerts / action */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-4 rounded-lg">
            <div className="text-sm text-muted">Reuse Efficiency</div>
            <div className="kpi-number mt-2">{reusePercent}%</div>
            <div className="text-xs text-muted mt-1">Water Reused Today</div>
            <div className="text-xs text-muted">460 ml³ out of 500 m³ treated</div>
          </div>

          <div className="glass-card p-4 rounded-lg">
            <div className="text-sm text-muted">Alerts Summary</div>
            <div className="mt-2">
              <div className="badge-warn inline-flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 7h2v6h-2zM11 15h2v2h-2z" fill="#dc2626"/></svg> {alerts.length} Alerts Active</div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button whileHover={{scale:1.02}} className="flex-1 px-4 py-3 bg-gradient-to-r from-accent to-primary text-white rounded">Start Process</motion.button>
            <button className="px-4 py-3 bg-white border rounded">Stop Process</button>
          </div>
        </div>
      </div>

      {/* Stage overview + schematic */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-muted">Stage Overview</div>
          <div className="mt-3">
            <div className="text-xs text-muted">Primary • Secondary • Tertiary</div>
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded overflow-hidden">
                <div style={{width:'40%'}} className="h-full bg-gradient-to-r from-accent to-primary"></div>
              </div>
              <div className="text-sm text-muted mt-2">Flow rate • 2.2 m • Auto mode</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-muted">Live Plant View</div>
          <div className="mt-3">
            <PlantSchematic />
          </div>
        </div>
      </div>
    </div>
  )
}
