import React from 'react'
export default function SensorCard({id, name, value, unit, status}){
  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-400">{name}</div>
          <div className="text-xl font-semibold">{value} <span className="text-sm text-gray-400">{unit}</span></div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${status==='ok'? 'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{status}</div>
      </div>
      <div className="mt-2 text-xs text-gray-400">Device ID: {id}</div>
    </div>
  )
}
