import React from 'react'
export default function LatestAlerts({alerts}){
  return (
    <div className="space-y-3">
      {alerts.map(a=> (
        <div key={a.id} className="p-3 rounded-md border-l-4 border-red-400 bg-white/5">
          <div className="text-sm font-semibold">{a.title}</div>
          <div className="text-xs text-gray-400">{a.time}</div>
          <div className="mt-1 text-gray-500 text-sm">{a.desc}</div>
        </div>
      ))}
    </div>
  )
}
