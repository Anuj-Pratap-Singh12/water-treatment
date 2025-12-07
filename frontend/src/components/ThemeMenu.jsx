// src/components/ThemeMenu.jsx
import React from "react";
import { useTheme } from "../theme/ThemeProvider";

export default function ThemeMenu() {
  const { theme, setTheme, dark, setDark } = useTheme();
  const swatches = [
    { key: "ocean", label: "Ocean", bg: "linear-gradient(135deg,#98e7ff,#5cd4d2)" },
    { key: "emerald", label: "Emerald", bg: "linear-gradient(135deg,#a7f3d0,#34d399)" },
    { key: "night", label: "Night", bg: "linear-gradient(135deg,#a5b4fc,#60a5fa)" },
  ];
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button className="px-3 py-2 border rounded-md bg-white/80 hover:bg-white text-sm"
              onClick={()=>setOpen(o=>!o)}>
        Theme
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white/95 shadow-xl p-3 z-40">
          <div className="text-xs text-gray-500 mb-2">Palette</div>
          <div className="grid grid-cols-3 gap-2">
            {swatches.map(s => (
              <button key={s.key}
                className={`h-10 rounded-lg border ${theme===s.key?'ring-2 ring-[var(--primary)]':''}`}
                style={{ background: s.bg }}
                title={s.label}
                onClick={()=> setTheme(s.key)}
              />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <div className="text-sm">Dark mode</div>
            <button
              onClick={()=> setDark(d=>!d)}
              className={`w-12 h-7 rounded-full relative transition ${
                dark ? 'bg-[var(--primary)]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition ${dark ? 'translate-x-5' : ''}`}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
