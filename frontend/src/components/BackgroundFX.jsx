// src/components/BackgroundFX.jsx
import React, { useEffect } from "react";
import Particles from "react-tsparticles";

/**
 * BackgroundFX:
 * - animated gradient via CSS (bg-animated)
 * - floating blurred blobs positioned absolutely with small parallax transforms
 * - optional particle layer (react-tsparticles) (comment out if you don't want it)
 */
export default function BackgroundFX() {
  useEffect(() => {
    // create few random blob positions (for visual variety)
    // no DOM creation here; handled inline below
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-animated" aria-hidden />
      {/* floating blobs; tune positions/colors */}
      <div className="parallax-blob" style={{ width: 360, height: 360, left: "6%", top: "6%", background: "radial-gradient(circle, rgba(6,182,212,0.28), transparent 40%)" }} />
      <div className="parallax-blob" style={{ width: 240, height: 240, right: "8%", top: "18%", background: "radial-gradient(circle, rgba(16,185,129,0.26), transparent 40%)" }} />
      <div className="parallax-blob" style={{ width: 420, height: 420, left: "40%", bottom: "6%", background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 40%)" }} />

      {/* Optional particles layer — lightweight config */}
      <Particles
        className="pointer-events-none fixed inset-0 z-10"
        options={{
          fpsLimit: 30,
          particles: {
            number: { value: 35, density: { enable: true, area: 800 } },
            color: { value: "#06b6d4" },
            opacity: { value: 0.06, random: true },
            size: { value: { min: 1, max: 4 } },
            move: { enable: true, speed: 0.7, direction: "none", outModes: "out" },
            links: { enable: false }
          },
          interactivity: { detectsOn: "canvas", events: { onHover: { enable: false }, onClick: { enable: false } } },
          detectRetina: true,
          fullScreen: { enable: false }
        }}
      />
    </>
  );
}
