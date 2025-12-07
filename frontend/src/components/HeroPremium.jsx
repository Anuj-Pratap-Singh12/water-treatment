import React from "react";
import { motion } from "framer-motion";
import ReactDOM from "react-dom";

export default function HeroPremium({
  title = "AquaRevive: Freshwater Recovery and Reuse System",
  subtitle = "A smart and sustainable solution for recovering, treating, and reusing freshwater to combat water scarcity.",
  onPrimary = () => {},
  onSecondary = () => {},
}) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image/gradient */}
      <div className="absolute inset-0">
        <div className="h-[520px] w-full bg-[url('/water.jpg')] bg-cover bg-center" />
        {/* Black transparent overlay for stronger text contrast */}
        <div className="absolute inset-0 bg-black/45" />
        {/* Subtle vertical gradient + slight blur for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/0" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* Spotlight gradients above image, below content to elevate elements */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(800px 380px at 18% 35%, rgba(255,255,255,0.24), transparent 60%), radial-gradient(700px 340px at 82% 42%, rgba(14,165,233,0.18), transparent 62%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center gap-8">
          {/* Copy */}
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white text-soft-shadow"
            >
              Aqua<span>  Revive</span>:
              <span className="block">Freshwater Recovery and Reuse System</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 text-base sm:text-lg md:text-xl text-slate-200/90 text-soft-shadow"
            >
              {subtitle}
            </motion.p>

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                onClick={onPrimary}
                className="btn-primary btn-elevated px-5 py-3 rounded-xl text-sm sm:text-base will-change-transform transition-transform hover:scale-[1.03] hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                Explore System
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                onClick={onSecondary}
                className="btn-outline btn-elevated px-5 py-3 rounded-xl text-sm sm:text-base will-change-transform transition-transform hover:scale-[1.03] hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                Learn More
              </motion.button>
            </div>
          </div>

          {/* Right card with KPI/brand blurb */}
          <div className="hidden md:block">
            <InteractiveTiltCard>
              {/* Gradient border wrapper */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2, ease: [0.2, 0.9, 0.2, 1], delay: 0.22 }}
                className="p-[2px] rounded-2xl bg-gradient-to-br from-cyan-400/80 via-teal-400/50 to-emerald-400/80 shadow-md hover:shadow-2xl transition-transform duration-200 will-change-transform"
              >
                <div className="glass-card card-elevated rounded-[16px] p-6 bg-white/75 dark:bg-slate-900/60 backdrop-blur-md text-slate-900 ring-1 ring-white/40 dark:ring-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-full p-2 shadow ring-1 ring-white/40 bg-brand"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-bold">AquaRevive</div>
                  <div className="text-sm text-slate-600">
                    Smart Water Recovery &amp; Reuse
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-700">
                Industry-grade monitoring, analytics, and process optimization
                for freshwater recovery and reuse. Built for municipalities,
                industry, and large campuses.
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="kpi-number text-gradient-brand">98%</div>
                  <div className="text-xs text-slate-600">Process Uptime</div>
                </div>
                <div className="text-center">
                  <div className="kpi-number text-gradient-brand">35%</div>
                  <div className="text-xs text-slate-600">Cost Savings</div>
                </div>
                <div className="text-center">
                  <div className="kpi-number text-gradient-brand">50k+</div>
                  <div className="text-xs text-slate-600">Sensors Managed</div>
                </div>
              </div>
                </div>
              </motion.div>
            </InteractiveTiltCard>
          </div>
        </div>
      </div>

      {/* Bottom fade to page bg */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-slate-50" />
    </section>
  );
}

function InteractiveTiltCard({ children }) {
  const ref = React.useRef(null);
  const [style, setStyle] = React.useState({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg)" });

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 6; // tilt left/right
    const rotateX = -((y - midY) / midY) * 6; // tilt up/down
    setStyle({ transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` });
  };

  const onMouseLeave = () => {
    setStyle({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg)" });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="transition-transform duration-200 will-change-transform"
      style={style}
    >
      {children}
    </div>
  );
}
