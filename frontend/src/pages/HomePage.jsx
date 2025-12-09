import React from "react";

// Using modern inline SVG icons instead of raster images
// to achieve a cleaner, high-quality look without extra deps.
import HeroPremium from "../components/HeroPremium";
import useGsapScrollAnimations from "../hooks/useGsapScrollAnimations";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
        onPrimary={() => onNavigate?.("process")}
        onSecondary={() => onNavigate?.("marketplace")}
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
      <section className="container mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center gsap-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Performance <span className="text-gradient-brand">Analytics</span>
          </h2>
          <p className="text-lg text-slate-600">Real-time insights into water recovery and treatment operations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Yearly Water Recovery Pie Chart */}
          <div className="group bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-slate-200/50 transition-all duration-300 backdrop-blur-sm gsap-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Yearly Water Recovery</h3>
                <p className="text-sm text-slate-500">Distribution across 4 major industries</p>
              </div>
              <div className="text-4xl font-bold text-cyan-600">100%</div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Textile", value: 35, description: "35%" },
                    { name: "Dairy", value: 25, description: "25%" },
                    { name: "Pharmaceutical", value: 20, description: "20%" },
                    { name: "Food Processing", value: 20, description: "20%" },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  <Cell fill="#06b6d4" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 bg-cyan-50/50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-slate-700"><strong>Textile:</strong> 35%</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-700"><strong>Dairy:</strong> 25%</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50/50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-700"><strong>Pharma:</strong> 20%</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-50/50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-slate-700"><strong>Food:</strong> 20%</span>
              </div>
            </div>
          </div>

          {/* Weekly Water Treated Quantity Line Chart */}
          <div className="group bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-slate-200/50 transition-all duration-300 backdrop-blur-sm gsap-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Weekly Water Treated</h3>
                <p className="text-sm text-slate-500">Treatment and discharge volume trends</p>
              </div>
              <div className="text-4xl font-bold text-emerald-600">10.1K L</div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={[
                  { day: "Mon", treated: 1200, discharged: 300 },
                  { day: "Tue", treated: 1400, discharged: 350 },
                  { day: "Wed", treated: 1600, discharged: 400 },
                  { day: "Thu", treated: 1550, discharged: 380 },
                  { day: "Fri", treated: 1800, discharged: 450 },
                  { day: "Sat", treated: 1300, discharged: 320 },
                  { day: "Sun", treated: 1100, discharged: 270 },
                ]}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                  label={{ value: "Volume (L)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  }}
                  cursor={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                  formatter={(value) => `${value} L`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="treated" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  name="Treated Water" 
                  dot={{ fill: "#06b6d4", r: 5 }}
                  activeDot={{ r: 7 }}
                  animationDuration={800}
                />
                <Line 
                  type="monotone" 
                  dataKey="discharged" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Discharged Water" 
                  dot={{ fill: "#f59e0b", r: 5 }}
                  activeDot={{ r: 7 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-4 bg-cyan-50/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Avg Treated</p>
                <p className="text-2xl font-bold text-cyan-600">1443 L</p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Avg Discharged</p>
                <p className="text-2xl font-bold text-amber-600">367 L</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
