import React from "react";

function StatusBadge({ level }){
  const map = {
    normal: { bg:"bg-green-100 text-green-700", label:"Normal" },
    alert:  { bg:"bg-yellow-100 text-yellow-700", label:"Alert" },
    critical:{ bg:"bg-red-100 text-red-700", label:"Critical" },
  };
  const s = map[level] || map.normal;
  return <span className={`text-xs px-2 py-1 rounded ${s.bg}`}>{s.label}</span>;
}

export default function MicrobialCard({ item, onUpload }){
  const status = !item.result ? "alert" :
    (item.result.ecoli>20 || item.result.virus>3 ? "critical" : "normal");

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">{item.target} Stage</div>
        <StatusBadge level={status} />
      </div>
      <div className="text-sm text-gray-500 mt-1">Scheduled: {new Date(item.time).toLocaleString()}</div>

      {item.result ? (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 border rounded text-center">
            <div className="text-xs text-gray-500">E. coli</div>
            <div className="text-xl font-semibold">{item.result.ecoli}</div>
          </div>
          <div className="p-3 border rounded text-center">
            <div className="text-xs text-gray-500">Virus Units</div>
            <div className="text-xl font-semibold">{item.result.virus}</div>
          </div>
          <div className="p-3 border rounded text-center">
            <div className="text-xs text-gray-500">Reviewed By</div>
            <div className="text-sm">Lab QA</div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <button className="px-3 py-2 border rounded" onClick={onUpload}>Upload Lab Result (mock)</button>
          <button className="px-3 py-2 border rounded">Download Chain of Custody</button>
        </div>
      )}
    </div>
  );
}
