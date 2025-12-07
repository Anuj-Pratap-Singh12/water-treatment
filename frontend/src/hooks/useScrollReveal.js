// src/hooks/useScrollReveal.js
import { useEffect } from "react";

export default function useScrollReveal(selector = ".reveal", options = {}) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // if you want one-time reveal, unobserve after becoming visible
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px", ...options });

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [selector, options]);
}
