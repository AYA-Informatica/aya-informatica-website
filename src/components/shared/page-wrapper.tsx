"use client"

import { motion } from "framer-motion"

const variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/**
 * FIX #14: Wrap every page in this to get smooth route transitions.
 * Used as the outermost element inside each page.tsx.
 */
export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
    </motion.div>
  )
}
