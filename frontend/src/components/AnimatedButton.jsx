// src/components/AnimatedButton.jsx
import React, { useRef } from "react";

/**
 * AnimatedButton: button with ripple effect & micro hover
 * Props: children, className, onClick
 */
export default function AnimatedButton({ children, className = "", onClick = () => {} }) {
  const wrap = useRef();

  const handleClick = (e) => {
    const rect = wrap.current.getBoundingClientRect();
    const circle = document.createElement("span");
    circle.className = "ripple";
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    circle.style.width = circle.style.height = `${Math.max(rect.width, rect.height) * 0.8}px`;
    wrap.current.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
    onClick(e);
  };

  return (
    <div ref={wrap} className={`ripple-wrap inline-block ${className}`} onClick={handleClick}>
      <button className="btn-animated">{children}</button>
    </div>
  );
}
