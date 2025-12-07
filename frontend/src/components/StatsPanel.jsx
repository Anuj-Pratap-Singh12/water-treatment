import React from 'react'
export default function StatsPanel(){
  const stats = [
    {label:'Freshwater Saved', value:'1.2M L'},
    {label:'Reuse Rate', value:'62%'},
    {label:'Avg. Turbidity', value:'3.2 NTU'}
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(s=> (
        <div key={s.label} className="glass-card p-4 rounded-lg">
          <div className="text-sm text-gray-400">{s.label}</div>
          <div className="text-xl font-semibold">{s.value}</div>
        </div>
      ))}
    </div>
  )
}
