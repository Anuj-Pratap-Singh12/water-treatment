import React from "react";
import PageSection from "../components/PageSection";
import { getMockModelInsights } from "../services/mockApi";
import TimeSeriesChart from "../components/charts/TimeSeriesChart";

export default function AnalyticsPage(){
  const [rows, setRows] = React.useState([]);
  const [series, setSeries] = React.useState([]);
  React.useEffect(()=> {
    setRows(getMockModelInsights());
    // dummy time-series for chart
    const t = Array.from({length: 24}, (_, i) => ({
      time: `${i}:00`,
      pH: +(6.8 + Math.sin(i/3)*0.4 + (Math.random()*0.2-0.1)).toFixed(2),
      turbidity: +(0.25 + Math.cos(i/4)*0.1 + (Math.random()*0.05-0.025)).toFixed(3),
    }));
    setSeries(t);
  }, []);

  return (
    <div className="space-y-10">
      <PageSection kicker="Analytics" title="Model & Performance Insights" subtitle="Mock insights for demo visualization.">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xl">
          <div className="absolute inset-0 pointer-events-none opacity-[.06] mix-blend-overlay" aria-hidden/>
          <table className="w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th className="text-left p-3">Model</th>
                <th className="text-left p-3">Train Acc</th>
                <th className="text-left p-3">Val Acc</th>
                <th className="text-left p-3">Test Acc</th>
                <th className="text-left p-3">Inference (s)</th>
                <th className="text-left p-3">Params</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.model} className="border-t transition hover:shadow-sm">
                  <td className="p-3 font-medium text-slate-900">{r.model}</td>
                  <td className="p-3">{r.trainAccuracy}%</td>
                  <td className="p-3">{r.valAccuracy}%</td>
                  <td className="p-3">{r.testAccuracy}%</td>
                  <td className="p-3">{r.inferenceTime}</td>
                  <td className="p-3">{r.parameters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      {/* KPI band */}
      <PageSection kicker="Highlights" title="Model KPIs" subtitle="Quick-glance metrics across the latest runs.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Avg Test Acc", value: "82.7%" },
            { label: "Median Inference", value: "0.298s" },
            { label: "Models Benchmarked", value: rows.length.toString() },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl border border-slate-200/70 bg-white shadow-md px-5 py-4">
              <div className="text-xs uppercase tracking-wide text-slate-600">{k.label}</div>
              <div className="mt-1 text-2xl font-bold tracking-tight">{k.value}</div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Charts placeholder section to extend page height */}
      <PageSection kicker="Performance" title="Accuracy vs. Inference" subtitle="Exploratory visualizations for trade-offs and scaling.">
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
          <div className="h-72 md:h-96">
            <TimeSeriesChart data={series} />
          </div>
        </div>
      </PageSection>

      {/* Case studies / insights */}
      <PageSection kicker="Insights" title="Optimization Notes" subtitle="Opportunities to improve accuracy and latency.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Quantization",
              body: "Apply post-training quantization to reduce model size and latency with minimal accuracy impact.",
            },
            {
              title: "Knowledge Distillation",
              body: "Distill large models into lighter students for faster inference while preserving performance.",
            },
            {
              title: "Efficient Backbones",
              body: "Prefer MobileNet/EfficientNet families for edge deployments and low compute environments.",
            },
            {
              title: "Batching & Caching",
              body: "Use micro-batching and cache warmup for consistent end-to-end latencies.",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-5">
              <div className="font-semibold text-slate-900">{c.title}</div>
              <div className="mt-1 text-sm text-slate-600">{c.body}</div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Long content section to ensure page scroll */}
      <PageSection kicker="Appendix" title="Benchmark Details" subtitle="Dataset splits, hardware, and evaluation protocol.">
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6 space-y-3">
          <p className="text-sm text-slate-700">Hardware: 8-core CPU, 16GB RAM, single RTX 3080. Inference measured on CPU unless specified.</p>
          <p className="text-sm text-slate-700">Datasets: CityWater v2, AquaBench v1. Train/Val/Test split: 70/15/15. Metrics averaged across 5 seeds.</p>
          <p className="text-sm text-slate-700">Protocol: Standardized pre-processing, early stopping, and LR scheduling. Reported times exclude IO overhead.</p>
        </div>
      </PageSection>
    </div>
  );
}
