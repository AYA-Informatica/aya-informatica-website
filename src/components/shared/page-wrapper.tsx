"use client"

import { useReducedMotion, motion } from "framer-motion"

const variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div>{children}</div>
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
    </motion.div>
  )
}
