// src/components/Header.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Header.jsx
 * Simplified header that includes:
 * - Brand
 * - Theme toggle (cycles built-in themes)
 * - Open menu button (dispatches swrr:openNav)
 *
 * Note: Theme toggles apply classes to document.documentElement (root).
 * Ensure your CSS supports .theme-emerald, .theme-night, .theme-dark if you use them.
 */

const THEMES = ["light", "theme-emerald", "theme-night", "dark"];
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "analytics", label: "Analytics" },
  { id: "sensors", label: "Sensors" },
  { id: "process", label: "Process" },
  { id: "marketplace", label: "Marketplace" },
];

export default function Header({ current = "home", onNavigate = () => {} }) {
  // Sticky + shadow on scroll
  const [scrolled, setScrolled] = React.useState(false);

  // Mobile menu (slide-down within header)
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // listen to side drawer state (if used) to animate hamburger to an "X"
  const [navOpen, setNavOpen] = React.useState(false);
  const toggleMenu = () => {
    setMobileOpen((v) => !v);
    // keep side drawer in sync if needed
    window.dispatchEvent(new CustomEvent("swrr:toggleNav"));
  };

  const [themeIndex, setThemeIndex] = React.useState(0);

  React.useEffect(() => {
    // initialize theme from html class if present
    const root = document.documentElement;
    const found = THEMES.indexOf(
      THEMES.find((t) => t && root.classList.contains(t)) || ""
    );
    if (found >= 0) setThemeIndex(found);
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const onOpen = () => setNavOpen(true);
    const onClose = () => setNavOpen(false);
    window.addEventListener("swrr:navOpen", onOpen);
    window.addEventListener("swrr:navClose", onClose);
    return () => {
      window.removeEventListener("swrr:navOpen", onOpen);
      window.removeEventListener("swrr:navClose", onClose);
    };
  }, []);

  const cycleTheme = () => {
    const next = (themeIndex + 1) % THEMES.length;
    setThemeIndex(next);
    const root = document.documentElement;
    // reset classes
    root.classList.remove("dark", "theme-emerald", "theme-night");
    const t = THEMES[next];
    if (t === "dark") {
      root.classList.add("dark");
    } else if (t === "theme-emerald" || t === "theme-night") {
      root.classList.add(t);
    }
  };

  const NavLink = ({ id, label }) => (
    <button
      onClick={() => {
        onNavigate(id);
        setMobileOpen(false);
      }}
      className={`relative px-3 py-2 text-sm font-medium rounded-full transition ${
        current === id
          ? "text-slate-900 bg-white/70 shadow-sm"
          : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
      }`}
    >
      <span>{label}</span>
      <span
        className={`absolute left-3 right-3 -bottom-1 h-[2px] rounded-full transition-opacity ${
          current === id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
      />
    </button>
  );

  return (
    <header
      className={`sticky top-0 left-0 w-full z-[60] transition-shadow ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 ${
          scrolled
            ? "backdrop-blur-xl bg-white/70 border-b border-slate-200/60"
            : "backdrop-blur-xl bg-white/50 border-b border-transparent"
        } rounded-b-2xl`}
      >
        <div className="flex items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="rounded-full p-2 shadow-md ring-1 ring-white/50 bg-gradient-to-br from-cyan-500 to-teal-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" fill="#fff" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-lg leading-tight">SWRR</div>
              <div className="text-xs text-slate-600">Smart Water Recovery &amp; Reuse</div>
            </div>
          </div>

          {/* Nav links (center) */}
          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center" aria-label="Primary">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-slate-200/70 bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-white/60">
              {NAV_ITEMS.map((it) => (
                <NavLink key={it.id} id={it.id} label={it.label} />
              ))}
            </div>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="group relative inline-flex items-center justify-center w-10 h-10 rounded-full border transition shadow-sm
                         border-slate-200 bg-white hover:bg-slate-100 hover:shadow-md hover:-translate-y-[1px]
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/40
                         dark:border-slate-700 dark:bg-black dark:hover:bg-slate-900"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden
                   className="text-slate-700 dark:text-slate-200">
                <path d="M21 12a9 9 0 1 1-9-9c.34 0 .68.02 1.01.06A7 7 0 0 0 21 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* CTA */}
            <button
              onClick={() => onNavigate("dashboard")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full text-white shadow-md hover:shadow-lg transition will-change-transform hover:-translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
            >
              Open App
            </button>

            {/* Menu (mobile trigger) */}
            <button
              onClick={toggleMenu}
              className="group relative p-2 rounded-xl ring-1 ring-white/40 text-white shadow-sm hover:shadow-md will-change-transform hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
              aria-label="Toggle menu"
              title="Menu"
            >
              <span className="block w-6 h-6 relative">
                <span
                  className={`absolute left-0 right-0 top-[6px] h-[2px] rounded bg-white transition-transform ${navOpen ? "translate-y-[6px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute left-0 right-0 top-[12px] h-[2px] rounded bg-white transition-opacity ${navOpen ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`absolute left-0 right-0 top-[18px] h-[2px] rounded bg-white transition-transform ${navOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0.9, 0.2, 1] }}
              className="md:hidden mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow"
              aria-label="Mobile"
            >
              <ul className="flex flex-col p-2">
                {NAV_ITEMS.map((it) => (
                  <li key={it.id}>
                    <button
                      onClick={() => {
                        onNavigate(it.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${
                        current === it.id
                          ? "bg-white shadow-sm text-slate-900"
                          : "hover:bg-white/70 text-slate-700 hover:text-slate-900"
                      }`}
                      aria-current={current === it.id ? "page" : undefined}
                    >
                      {it.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>

    </header>
  );
}
