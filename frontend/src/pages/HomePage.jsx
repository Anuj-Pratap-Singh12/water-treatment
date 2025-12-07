import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// Using modern inline SVG icons instead of raster images
// to achieve a cleaner, high-quality look without extra deps.
import HeroPremium from "../components/HeroPremium";
import useGsapScrollAnimations from "../hooks/useGsapScrollAnimations";

export default function HomePage({ onNavigate }) {
  useGsapScrollAnimations();

  const IconWrap = ({ children }) => (
    <div className="h-32 w-full rounded-xl bg-gradient-to-tr from-cyan-100 via-blue-100 to-teal-100 flex items-center justify-center shadow-sm">
      <div className="text-cyan-600">{children}</div>
    </div>
  );

  const IconWaterCycle = () => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-4.5 5-6 7.5-6 10a6 6 0 1 0 12 0c0-2.5-1.5-5-6-10z" fill="currentColor" opacity="0.15" />
      <path d="M12 3c-4.5 5-6 7.5-6 10a6 6 0 0 0 12 0c0-2.5-1.5-5-6-10z" />
      <path d="M7 14c1.2 1.2 3 .8 3-.7" />
      <path d="M17 14c-1.2 1.2-3 .8-3-.7" />
    </svg>
  );

  const IconRecycleWater = () => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l3-5 3 5" />
      <path d="M18 13l3 5 3-5" transform="translate(-3 -2)" />
      <path d="M9 21h6" />
      <path d="M12 7c-3 3-4 4.5-4 6a4 4 0 1 0 8 0c0-1.5-1-3-4-6z" fill="currentColor" opacity="0.15" />
      <path d="M12 7c-3 3-4 4.5-4 6a4 4 0 0 0 8 0c0-1.5-1-3-4-6z" />
    </svg>
  );

  const IconTreatmentPlant = () => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="7" height="8" rx="1" />
      <rect x="14" y="7" width="7" height="11" rx="1" />
      <path d="M3 18h18" />
      <path d="M6 10V7c0-1.1.9-2 2-2h8" />
      <circle cx="17.5" cy="11.5" r="2.5" fill="currentColor" opacity="0.15" />
    </svg>
  );

  const IconScarcity = () => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5c-3.2 3.6-4.5 5.4-4.5 7.2a4.5 4.5 0 0 0 9 0c0-1.8-1.3-3.6-4.5-7.2z" />
      <path d="M6 20l2-1 2 1 2-1 2 1 2-1" />
      <path d="M12 9v4" />
    </svg>
  );

  // sample chart data
  const weeklyFlow = [
    { day: "Mon", intake: 1000, reuse: 700 },
    { day: "Tue", intake: 1200, reuse: 850 },
    { day: "Wed", intake: 1400, reuse: 900 },
    { day: "Thu", intake: 1300, reuse: 950 },
    { day: "Fri", intake: 1600, reuse: 1100 },
  ];

  const reuseBySector = [
    { sector: "Agriculture", value: 45 },
    { sector: "Industry", value: 25 },
    { sector: "Household", value: 20 },
    { sector: "Other", value: 10 },
  ];

  const COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen  ">
      {/* Premium Hero */}
      <HeroPremium
        subtitle="A smart and sustainable solution for recovering, treating, and reusing freshwater to combat water scarcity."
        onPrimary={() => onNavigate?.("analytics")}
        onSecondary={() => onNavigate?.("process")}
      />

      {/* ---------------- MISSION ---------------- */}
      <section className="container mx-auto max-w-6xl px-6  text-center gsap-fade-up">
        <div className="p-10 pt-30 rounded-2xl bg-white/0 border border-transparent">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Project <span className="text-gradient-brand">Mission</span>
          </h2>
          <p className="text-lg italic text-slate-700 max-w-3xl mx-auto">
            To promote sustainable recovery and reuse of freshwater resources through innovative,
            eco-friendly, and efficient water management solutions.
          </p>
        </div>
      </section>

      {/* ---------------- 4 COLUMNS ---------------- */}
      <section className="container mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gsap-stagger pb-12">
          {/* Water Cycle */}
          <div className="group glass-tile bg-white p-6 rounded-2xl flex flex-col gap-3 min-h-[320px] shadow-sm transition-transform transition-shadow duration-300 will-change-transform hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-[2px] focus-within:ring-2 focus-within:ring-cyan-500/30 gsap-card">
            <IconWrap>
              <IconWaterCycle />
            </IconWrap>
            <h3 className="text-xl font-semibold text-slate-800 transition-colors group-hover:text-slate-900">Water <span className="text-gradient-brand">Cycle</span></h3>
            <p className="text-slate-700 text-sm md:text-base">
              Water moves through evaporation, condensation, precipitation, and infiltration. Balanced cycles sustain rivers, aquifers, and ecosystems.
            </p>
          </div>

          {/* Recycled Water */}
          <div className="group glass-tile bg-white p-6 rounded-2xl flex flex-col gap-3 min-h-[320px] shadow-sm transition-transform transition-shadow duration-300 will-change-transform hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-[2px] focus-within:ring-2 focus-within:ring-cyan-500/30 gsap-card">
            <IconWrap>
              <IconRecycleWater />
            </IconWrap>
            <h3 className="text-xl font-semibold text-slate-800 transition-colors group-hover:text-slate-900">Recycled <span className="text-gradient-brand">Water</span></h3>
            <p className="text-slate-700 text-sm md:text-base">
              Treated wastewater is safely reused across farms, industry, and cities. Reuse lowers freshwater demand and supports circularity.
            </p>
          </div>

          {/* Treatment Plants */}
          <div className="group glass-tile bg-white p-6 rounded-2xl flex flex-col gap-3 min-h-[320px] shadow-sm transition-transform transition-shadow duration-300 will-change-transform hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-[2px] focus-within:ring-2 focus-within:ring-cyan-500/30 gsap-card">
            <IconWrap>
              <IconTreatmentPlant />
            </IconWrap>
            <h3 className="text-xl font-semibold text-slate-800 transition-colors group-hover:text-slate-900">Treatment <span className="text-gradient-brand">Plants</span></h3>
            <p className="text-slate-700 text-sm md:text-base">
              Modern plants remove solids, chemicals, and microbes to make water safe. Optimized processes enable reuse or compliant discharge.
            </p>
          </div>

          {/* Water Scarcity */}
          <div className="group glass-tile bg-white p-6 rounded-2xl flex flex-col gap-3 min-h-[320px] shadow-sm transition-transform transition-shadow duration-300 will-change-transform hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-[2px] focus-within:ring-2 focus-within:ring-cyan-500/30 gsap-card">
            <IconWrap>
              <IconScarcity />
            </IconWrap>
            <h3 className="text-xl font-semibold text-slate-800 transition-colors group-hover:text-slate-900">Water <span className="text-gradient-brand">Scarcity</span></h3>
            <p className="text-slate-700 text-sm md:text-base">
              Shortages occur when demand exceeds available clean water. Conservation, leak control, and reuse strengthen resilience.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- CHARTS SECTION ---------------- */}
      <section className="container mx-auto max-w-6xl px-6 pb-20 space-y-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-800">
          Analytics <span className="text-gradient-brand">Overview</span>
        </h2>
        <p className="mt-2 text-center text-slate-600 max-w-3xl mx-auto">
          Live operational insights across intake, treatment, and reuse streams.
          Benchmark performance and track key metrics to drive smarter decisions.
        </p>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Line Chart */}
          <div className="glass-card p-6 rounded-2xl min-w-0 gsap-card transition-transform transition-shadow duration-300 hover:scale-[1.02] hover:shadow-xl will-change-transform">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Flow (<span className="text-gradient-brand">kL</span>)</h3>
            <div className="h-64" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyFlow}>
                  <XAxis dataKey="day" tick={{ fill: "#475569" }} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="intake" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="reuse" stroke="#06B6D4" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="glass-card p-6 rounded-2xl min-w-0 gsap-card transition-transform transition-shadow duration-300 hover:scale-[1.02] hover:shadow-xl will-change-transform">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Reuse by Sector (<span className="text-gradient-brand">%</span>)</h3>
            <div className="h-64" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reuseBySector}
                    dataKey="value"
                    nameKey="sector"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {reuseBySector.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#334155" }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate?.("analytics")}
            className="btn-primary btn-animated will-change-transform hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            View Detailed Analytics
          </button>
        </div>
      </section>
    </div>
  );
}
