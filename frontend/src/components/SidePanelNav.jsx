import React from "react";

export default function SidePanelNav({ current = "home", onNavigate = () => {} }) {
  const [open, setOpen] = React.useState(false);

  // open via custom event if you emit: window.dispatchEvent(new Event("swrr:openNav"))
  React.useEffect(() => {
    const openHandler = () => setOpen(true);
    const toggleHandler = () => setOpen((v) => !v);
    window.addEventListener("swrr:openNav", openHandler);
    window.addEventListener("swrr:toggleNav", toggleHandler);
    return () => {
      window.removeEventListener("swrr:openNav", openHandler);
      window.removeEventListener("swrr:toggleNav", toggleHandler);
    };
  }, []);

  // Esc to close
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock body scroll only when open
  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new Event("swrr:navOpen"));
      return () => {
        document.body.style.overflow = prev;
      };
    } else {
      window.dispatchEvent(new Event("swrr:navClose"));
    }
  }, [open]);

  const menuItems = [
    { key: "home", label: "Overview" },
    { key: "dashboard", label: "Dashboard" },
    { key: "swrr", label: "SWRR Dashboard" },
    { key: "process", label: "Process Designer" },
    { key: "marketplace", label: "Marketplace" },
    { key: "edna", label: "eDNA Monitor" },
    { key: "analytics", label: "Analytics" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <>
      {/* Floating menu button removed; header hamburger controls the drawer */}

      {/* Overlay (rendered only when open) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm"
          aria-hidden
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[90] w-80 sm:w-88 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
                    border-r border-slate-200/60 dark:border-slate-800/60 shadow-2xl
                    transform transition-transform duration-200 will-change-transform
                    ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-100/80 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 shadow-md ring-1 ring-white/50 bg-gradient-to-r from-sky-500 to-emerald-500">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" fill="#fff" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">SWRR</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Smart Water Recovery</div>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-label="Close navigation"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* SCROLLABLE menu list */}
          <nav className="flex-1 overflow-y-auto overscroll-contain p-5 flex flex-col gap-3 [scrollbar-gutter:stable]">
            {menuItems.map((it) => {
              const active = current === it.key;
              return (
                <button
                  key={it.key}
                  onClick={() => {
                    onNavigate(it.key);
                    setOpen(false); // close after selection
                  }}
                  className={`text-left w-full px-4 py-3 rounded-xl font-medium tracking-wide transition flex items-center gap-3 ${
                    active
                      ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md"
                      : "hover:bg-white/60 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={`w-8 h-8 rounded-md flex items-center justify-center ${active ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="8" fill={active ? "white" : "#06b6d4"} />
                    </svg>
                  </span>
                  <span className="flex-1">{it.label}</span>
                  {!active && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Go</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer tip */}
          <div className="p-5 pt-0 shrink-0">
            <div className="rounded-xl bg-white/60 dark:bg-slate-800/60 p-4 text-sm text-gray-700 dark:text-gray-300 shadow-inner">
              💡 Try themes: <b>Ocean / Emerald / Night</b> + Dark mode.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
