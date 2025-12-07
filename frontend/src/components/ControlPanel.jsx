// src/components/ControlPanel.jsx
import React from 'react'
import PlantSchematic from './PlantSchematic'

export default function ControlPanel(){
  const [pumpOn, setPumpOn] = React.useState(true)
  const [aeratorAuto, setAeratorAuto] = React.useState(true)

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-lg font-semibold">Control Panel</h3>
      <p className="text-sm text-muted mt-1">Manual control and dosing overview</p>

      <div className="mt-6 schematic-wrap">
        <PlantSchematic />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded text-center">
          <div className="text-sm text-muted">Pump 1</div>
          <div className="mt-3 flex justify-center gap-2">
            <button onClick={()=>setPumpOn(true)} className={`px-3 py-2 rounded ${pumpOn ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Start</button>
            <button onClick={()=>setPumpOn(false)} className={`px-3 py-2 rounded ${!pumpOn ? 'bg-gray-200' : 'bg-white border'}`}>Stop</button>
          </div>
        </div>

        <div className="p-4 bg-white border rounded text-center">
          <div className="text-sm text-muted">Aerator</div>
          <div className="mt-3 flex justify-center gap-2">
            <button onClick={()=>setAeratorAuto(false)} className={`px-3 py-2 rounded ${!aeratorAuto ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Manual</button>
            <button onClick={()=>setAeratorAuto(true)} className={`px-3 py-2 rounded ${aeratorAuto ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Auto</button>
          </div>
        </div>

        <div className="p-4 bg-white border rounded text-center">
          <div className="text-sm text-muted">Chemical Level</div>
          <div className="mt-3 text-xl font-semibold">86%</div>
        </div>
      </div>
    </div>
  )
}
