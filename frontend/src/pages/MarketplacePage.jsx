import React from "react";
import PageSection from "../components/PageSection";
import { listListings, createListing, buyListing, getLedger } from "../services/mockApi";
import MarketplaceCard from "../components/MarketplaceCard";
import WaterLedger from "../components/WaterLedger";

export default function MarketplacePage(){
  const [items, setItems] = React.useState([]);
  const [ledger, setLedger] = React.useState([]);
  const [form, setForm] = React.useState({ qty: 1000, price: 100, turbidity: 5, BOD: 10, TN: 2, seller: "Plant A" });

  const load = ()=> { setItems(listListings()); setLedger(getLedger()); };
  React.useEffect(load,[]);

  const actions = (
    <>
      <button className="btn-outline" onClick={load}>Refresh</button>
      <button className="btn-primary" onClick={() => { createListing({ ...form, id: Date.now().toString() }); load(); }}>Create Listing</button>
    </>
  );

  return (
    <div className="space-y-10">
      <PageSection kicker="Marketplace" title="Water Credit Exchange" subtitle="List surplus treated water and buy credits to enable circular reuse." actions={actions}>
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input className="p-2 border border-slate-200 rounded" value={form.qty} onChange={e=>setForm(f=>({...f, qty:+e.target.value||0}))} placeholder="Qty (L)"/>
            <input className="p-2 border border-slate-200 rounded" value={form.price} onChange={e=>setForm(f=>({...f, price:+e.target.value||0}))} placeholder="Price"/>
            <input className="p-2 border border-slate-200 rounded" value={form.turbidity} onChange={e=>setForm(f=>({...f, turbidity:+e.target.value||0}))} placeholder="Turbidity NTU"/>
            <input className="p-2 border border-slate-200 rounded" value={form.BOD} onChange={e=>setForm(f=>({...f, BOD:+e.target.value||0}))} placeholder="BOD mg/L"/>
            <input className="p-2 border border-slate-200 rounded" value={form.TN} onChange={e=>setForm(f=>({...f, TN:+e.target.value||0}))} placeholder="TN mg/L"/>
          </div>
        </div>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PageSection title="Available Listings">
          <div className="space-y-3">
            {items.length===0 && <div className="text-slate-500">No listings yet.</div>}
            {items.map((it)=> (
              <div key={it.id} className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-4">
                <MarketplaceCard item={it} onBuy={() => { buyListing({ buyer:"Factory X", id: it.id }); load(); }} />
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection title="Water Ledger (tamper-style)">
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-4">
            <WaterLedger entries={ledger} />
          </div>
        </PageSection>
      </div>

      {/* Extra section to extend page height */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
        <div className="text-lg font-semibold">Exchange Notes</div>
        <ul className="mt-2 text-sm text-slate-600 list-disc list-inside space-y-1">
          <li>Quality metrics must meet local regulation thresholds before trade.</li>
          <li>Settlement occurs on delivery confirmation within 24 hours.</li>
          <li>Use credits to offset freshwater withdrawals and reduce fees.</li>
        </ul>
      </div>
    </div>
  );
}
