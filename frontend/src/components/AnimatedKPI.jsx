// src/components/AnimatedKPI.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * AnimatedKPI
 * Props:
 *  - value (number) required
 *  - duration (ms) default 1200
 *  - format (fn) optional — receive numeric value and return string (overrides suffix)
 *  - suffix (string) optional (e.g. '%', 'L')
 */
export default function AnimatedKPI({ value = 0, duration = 1200, format, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = prevValueRef.current || 0;
    const to = Number(value) || 0;
    const diff = to - from;
    cancelAnimationFrame(rafRef.current);

    function step(now) {
      if (!startRef.current) startRef.current = start;
      const t = Math.min(1, (now - start) / Math.max(1, duration));
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = from + diff * eased;
      setDisplay(cur);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        prevValueRef.current = to;
        startRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  // default formatter: integer with commas if large, or 1 decimal for fractional
  const defaultFormat = (v) => {
    const n = Math.abs(v) >= 1000 ? Math.round(v) : Math.round(v * 10) / 10;
    return n.toLocaleString();
  };

  let output;
  if (typeof format === "function") {
    output = format(display);
  } else {
    // show as rounded integer if >=1000 or whole; else one decimal
    if (Math.abs(display) >= 1000) output = Math.round(display).toLocaleString();
    else {
      const rounded = Math.round(display * 10) / 10;
      output = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    }
  }

  return (
    <span className="inline-block">
      {output}{suffix}
    </span>
  );
}
