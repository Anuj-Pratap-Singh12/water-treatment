// src/components/LiveMonitoringGrid.jsx
import React from 'react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import KPICard from './KPICard'

function MiniSpark({ data = [] }){
  // data: array of numbers
  const points = data.slice(-20)
  return (
    <svg className="spark" viewBox="0 0 100 30" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#06b6d4"
        strokeWidth="1.6"
        points={points.map((v,i) => `${(i/(points.length-1))*100},${30 - (v/Math.max(...points,1))*28}`).join(' ')}
      />
    </svg>
  )
}

export default function LiveMonitoringGrid({ series = [] }){
  // build simple mock metrics
  const metrics = [
    { name:'Flow Rate', value:'18.4 m³/hr', key:'flow', color:'#06b6d4' },
    { name:'pH', value:'7.2', key:'pH', color:'#06b6d4' },
    { name:'Dissolved Oxygen', value:'0.9 mg/L', key:'do', color:'#f59e0b' },
    { name:'Turbidity', value:'3 NTU', key:'turb', color:'#06b6d4' },
    { name:'TDS', value:'780 ppm', key:'tds', color:'#06b6d4' },
    { name:'ORP', value:'250 mV', key:'orp', color:'#06b6d4' }
  ]

  // generate random mini-series if series passed
  const randomSeries = () => Array.from({length:20}, ()=> Math.random()*8 + 1)

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Live Monitoring</h3>
          <p className="text-sm text-muted">Secondary</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded text-sm">Add Sensor</button>
          <button className="px-3 py-1 bg-white border rounded text-sm">Calibrate</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {metrics.map(m => (
          <div key={m.key} className="glass-tile p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted">{m.name}</div>
                <div className="text-xl font-semibold mt-1">{m.value}</div>
              </div>
              <div style={{width:120, height:48}}>
                <MiniSpark data={randomSeries()} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-muted">Last updated: a few seconds ago</div>
    </div>
  )
}
