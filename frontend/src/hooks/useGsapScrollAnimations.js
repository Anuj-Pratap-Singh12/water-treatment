// src/hooks/useGsapScrollAnimations.js
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useGsapScrollAnimations() {
  useEffect(() => {
    if (!gsap.core) return;
    gsap.registerPlugin(ScrollTrigger);

    const fades = document.querySelectorAll(".gsap-fade-up");
    fades.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
            once: false,
          },
        }
      );
    });

    const cards = document.querySelectorAll(".gsap-card");
    cards.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
            once: false,
          },
        }
      );
    });

    // Stagger groups
    const groups = document.querySelectorAll(".gsap-stagger");
    groups.forEach((group) => {
      const items = group.querySelectorAll(".gsap-card");
      if (!items.length) return;
      gsap.fromTo(
        items,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
            once: false,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
