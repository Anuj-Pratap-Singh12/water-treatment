// src/components/PageTransitionWrapper.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Wrap page content to animate on mount/unmount.
 * Usage: <PageTransitionWrapper key={route}><PageComponent /></PageTransitionWrapper>
 */
export default function PageTransitionWrapper({ children, locationKey = "page" }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={locationKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.42, ease: [0.2, 0.9, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
