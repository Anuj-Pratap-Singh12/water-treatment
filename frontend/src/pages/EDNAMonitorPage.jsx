import React from "react";
import PageSection from "../components/PageSection";
import { listBioSnapshots, scheduleBioCheck, uploadBioResult } from "../services/mockApi";
import MicrobialCard from "../components/MicrobialCard";

export default function EDNAMonitorPage(){
  const [items, setItems] = React.useState([]);
  const [next, setNext] = React.useState({ day: 7, target: "Secondary" });
  const load = ()=> setItems(listBioSnapshots());
  React.useEffect(load,[]);

  const actions = (
    <button className="btn-primary" onClick={() => { scheduleBioCheck({ inDays: +next.day||7, target: next.target }); load(); }}>
      Schedule
    </button>
  );

  return (
    <div className="space-y-8">
      <PageSection kicker="Biological Safety" title="eDNA & Microbial Snapshot" subtitle="Schedule periodic biological checks and attach lab results." actions={actions}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select className="p-2 border rounded" value={next.target} onChange={e=>setNext(n=>({...n, target:e.target.value}))}>
            <option>Primary</option><option>Secondary</option><option>Tertiary</option>
          </select>
          <input className="p-2 border rounded" value={next.day} onChange={e=>setNext(n=>({...n, day:+e.target.value||1}))} placeholder="In days"/>
        </div>
      </PageSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.length===0 && <PageSection title="No snapshots yet" subtitle="Schedule your first biological check above." />}
        {items.map(s=> (
          <PageSection key={s.id} title={`${s.target} Stage`} subtitle={new Date(s.time).toLocaleString()}>
            <MicrobialCard item={s} onUpload={()=>{ uploadBioResult(s.id, { ecoli: Math.round(Math.random()*30), virus: Math.round(Math.random()*5) }); load(); }} />
          </PageSection>
        ))}
      </div>
    </div>
  );
}
