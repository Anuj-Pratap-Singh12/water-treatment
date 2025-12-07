// src/components/WaveDivider.jsx
import React from "react";

/**
 * WaveDivider
 * Props:
 *  - className (optional)
 *  - colorFrom / colorTo (optional) - fallback uses CSS variables
 *  - flip (boolean) - flip vertically
 */
export default function WaveDivider({
  className = "",
  colorFrom = "var(--primary)",
  colorTo = "var(--accent)",
  flip = false,
}) {
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="0 0 1200 80"
        width="100%"
        height="80"
        preserveAspectRatio="none"
        style={{ display: "block", transform: flip ? "scaleY(-1)" : "none" }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1">
            <stop offset="0" stopColor={colorFrom} stopOpacity="0.12" />
            <stop offset="1" stopColor={colorTo} stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <path
          d="M0 30 C140 70 260 10 480 30 C700 50 820 10 1000 36 C1100 52 1200 38 1200 38 L1200 80 L0 80 Z"
          fill="url(#waveGrad)"
        />
      </svg>
    </div>
  );
}
