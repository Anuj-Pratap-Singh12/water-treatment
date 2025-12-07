// src/components/ParallaxHero.jsx
import React, { useEffect, useRef } from "react";

/**
 * ParallaxHero: a hero area with layered elements that move at different speeds on scroll.
 * Drop into HomePage or any page top.
 */
export default function ParallaxHero({ title = "Smart Water Recovery & Reuse", subtitle }) {
  const layer1 = useRef();
  const layer2 = useRef();
  const layer3 = useRef();

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // slower -> background
      if (layer1.current) layer1.current.style.transform = `translateY(${scrollY * 0.03}px)`;
      if (layer2.current) layer2.current.style.transform = `translateY(${scrollY * 0.06}px)`;
      if (layer3.current) layer3.current.style.transform = `translateY(${scrollY * 0.12}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-12">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div ref={layer1} style={{ left: "6%", top: "8%" }} className="parallax-blob" />
        <div ref={layer2} style={{ right: "4%", top: "20%" }} className="parallax-blob" />
        <div ref={layer3} style={{ left: "30%", bottom: "6%" }} className="parallax-blob" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight reveal">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-muted reveal">{subtitle}</p>}
        <div className="mt-8 flex gap-4 reveal">
          <button className="btn-primary btn-animated">Open Dashboard</button>
          <button className="btn-outline btn-animated">Design Treatment</button>
        </div>
      </div>
    </section>
  );
}
