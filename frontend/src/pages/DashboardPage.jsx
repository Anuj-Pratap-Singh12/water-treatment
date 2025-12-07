import React from "react";
import PageSection from "../components/PageSection";
import AquaSensePanel from "../components/AquaSensePanel";
import LiveMonitoringGrid from "../components/LiveMonitoringGrid";
import ControlPanel from "../components/ControlPanel";
import KPICard from "../components/KPICard";
import { getMockTimeseries, getMockAlerts } from "../services/mockApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function DashboardPage() {
  const [series, setSeries] = React.useState([]);
  const [alerts, setAlerts] = React.useState([]);

  React.useEffect(() => {
    setSeries(getMockTimeseries());
    setAlerts(getMockAlerts());
  }, []);

  const kpis = [
    { title: "Daily Water Treated", value: "520 m³", color: "from-accent to-primary" },
    { title: "Energy Consumption", value: "3.2 kWh/m³", color: "from-yellow-400 to-yellow-600" },
    { title: "Reuse Rate", value: "92%", color: "from-green-400 to-green-600" },
    { title: "Active Alerts", value: alerts.length, color: "from-red-400 to-red-600" },
  ];

  const lineData = series.map((s, i) => ({ time: `T${i}`, value: s }));
  const barData = [
    { stage: "Primary", flow: 120 },
    { stage: "Secondary", flow: 90 },
    { stage: "Tertiary", flow: 60 },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url("/water.jpg")` }}
      />

      {/* Optional dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Main Content */}
      <div className="relative z-10 p-8 space-y-8">
        {/* Top KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((k, idx) => (
            <KPICard key={idx} title={k.title} value={k.value} gradient={k.color} />
          ))}
        </div>

        {/* AquaSense Panel */}
        <AquaSensePanel alerts={alerts} />

        {/* Live Metrics & Charts */}
        <PageSection title="Process Trends & Metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LiveMonitoringGrid series={series} />
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Flow Rate Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Stage-wise Flow</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="flow" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ControlPanel />
          </div>
        </PageSection>

        {/* Alerts & Notes */}
        <PageSection title="Alerts & Notes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Active Alerts</h3>
              {alerts.length === 0 ? (
                <div className="text-sm text-muted">No active alerts</div>
              ) : (
                <ul className="space-y-2 text-sm">
                  {alerts.map((a, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                      {a.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Shift Notes</h3>
              <textarea
                className="w-full h-40 border rounded p-3 text-sm"
                placeholder="Add shift notes or observations..."
              />
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}
