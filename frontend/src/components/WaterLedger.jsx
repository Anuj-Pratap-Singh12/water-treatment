import React from "react";

export default function WaterLedger({ entries=[] }){
  return (
    <div className="space-y-2 text-sm">
      {entries.slice().reverse().map(e=>(
        <div key={e.hash} className="p-3 rounded border">
          <div className="text-xs text-gray-500">{e.time} • {e.type} • actor: {e.actor}</div>
          <div className="mt-1">{e.note}</div>
          <div className="text-xs text-gray-400 mt-1">hash: {e.hash.slice(0,12)}… prev: {e.prevHash?e.prevHash.slice(0,10):"null"}</div>
        </div>
      ))}
      {entries.length===0 && <div className="text-gray-500">No ledger entries yet.</div>}
    </div>
  );
}
