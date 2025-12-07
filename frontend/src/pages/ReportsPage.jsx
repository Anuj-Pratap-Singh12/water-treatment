import React from "react";
import PageSection from "../components/PageSection";
import { exportCsv } from "../services/mockApi";

export default function ReportsPage(){
  const download = () => {
    exportCsv([{report:"SWRR Demo", date:new Date().toISOString(), author:"Team"}], "swrr_report.csv");
  };

  return (
    <div className="space-y-8">
      <PageSection kicker="Reports" title="Exports & Compliance" subtitle="Download summaries and ledger excerpts for audits."
        actions={<button className="btn-primary" onClick={download}>Download CSV</button>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-tile p-5 rounded-xl">
            <div className="text-sm text-muted">Simulation Summary</div>
            <div className="mt-2 text-sm">Latest results and target checks.</div>
          </div>
          <div className="glass-tile p-5 rounded-xl">
            <div className="text-sm text-muted">Ledger Extract</div>
            <div className="mt-2 text-sm">Tamper-style hash trail.</div>
          </div>
          <div className="glass-tile p-5 rounded-xl">
            <div className="text-sm text-muted">Marketplace Activity</div>
            <div className="mt-2 text-sm">Listings & purchases summary.</div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
