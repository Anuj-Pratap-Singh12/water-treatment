// src/components/CustomCursor.jsx
import React, { useEffect, useRef } from "react";

/**
 * CustomCursor:
 * - single dot + translucent trailing circle
 * - disabled on touch devices via media query in CSS
 */
export default function CustomCursor() {
  const dotRef = useRef();
  const trailRef = useRef();
  const mouse = useRef({ x: -100, y: -100, tx: -100, ty: -100 });

  useEffect(() => {
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    let raf = null;

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      mouse.current.x = x;
      mouse.current.y = y;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
    };

    const animate = () => {
      // trailing circle follows smoothly
      mouse.current.tx += (mouse.current.x - mouse.current.tx) * 0.12;
      mouse.current.ty += (mouse.current.y - mouse.current.ty) * 0.12;
      trail.style.left = `${mouse.current.tx}px`;
      trail.style.top = `${mouse.current.ty}px`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    // hide on mousedown for click feedback
    const onDown = () => { dot.style.transform = "scale(.85)"; trail.style.transform = "scale(.95)"; }
    const onUp = () => { dot.style.transform = "scale(1)"; trail.style.transform = "scale(1)"; }
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={trailRef} className="cursor-trail" style={{ width: 28, height: 28, borderRadius: 9999, border: "2px solid rgba(6,182,212,0.28)" }} />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
