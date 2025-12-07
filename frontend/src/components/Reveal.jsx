// src/components/Reveal.jsx
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/**
 * Reveal
 * Props:
 *  - children
 *  - delay (ms) default 0
 *  - direction: "up" | "down" | "left" | "right" (default "up")
 *  - distance: px translation distance, default 18
 *  - threshold: intersection threshold (0-1), default 0.12
 *  - className: extra classes
 *  - stagger: number in ms - if provided, children will animate in staggered sequence
 *
 * Usage:
 *  <Reveal stagger={80}>
 *     <div>one</div>
 *     <div>two</div>
 *  </Reveal>
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 18,
  threshold = 0.12,
  className = "",
  stagger = 0,
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: true, rootMargin: "0px 0px -6% 0px" });

  const getInitial = () => {
    switch (direction) {
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      case "up":
      default:
        return { opacity: 0, y: distance };
    }
  };

  const initial = getInitial();

  // if stagger provided and children is an array/fragment, wrap them with motion variants
  if (stagger && React.Children.count(children) > 1) {
    const container = {
      visible: {
        transition: {
          staggerChildren: stagger / 1000,
          delayChildren: delay / 1000,
          when: "beforeChildren",
        },
      },
      hidden: {},
    };
    const childVariant = {
      hidden: initial,
      visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] } },
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={container}
        className={className}
        style={{ willChange: "transform, opacity" }}
      >
        {React.Children.map(children, (child, i) => (
          <motion.div key={i} variants={childVariant}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // default single-element reveal
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.58, delay: delay / 1000, ease: [0.2, 0.9, 0.2, 1] }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
