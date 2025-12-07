// src/theme/ThemeProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext({ theme: "ocean", setTheme: () => {}, dark: false, setDark: () => {} });
export const useTheme = () => useContext(ThemeCtx);

const THEMES = ["ocean", "emerald", "night"];

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("swrr_theme") || "ocean");
  const [dark, setDark] = useState(() => localStorage.getItem("swrr_dark") === "true");

  useEffect(() => {
    localStorage.setItem("swrr_theme", theme);
    localStorage.setItem("swrr_dark", String(dark));
    const cls = document.documentElement.classList;
    // remove old theme-* classes (optional visual themes)
    THEMES.forEach(t => cls.remove(`theme-${t}`));
    cls.add(`theme-${theme}`);
    // Tailwind dark mode relies on the 'dark' class on the root
    if (dark) cls.add("dark"); else cls.remove("dark");
  }, [theme, dark]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, dark, setDark }}>
      {children}
    </ThemeCtx.Provider>
  );
}
