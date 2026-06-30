"use client"

import { useReducedMotion, motion } from "framer-motion"
import { pageWrapperVariants } from "./motion-div"

export function PageWrapper({ children }: { readonly children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div>{children}</div>
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={pageWrapperVariants}>
      {children}
    </motion.div>
  )
}
