"use client"

import { motion, type Variants, type HTMLMotionProps } from "framer-motion"

// ── Variants ───────────────────────────────────────────────

/**
 * FIX #5: MotionItem previously used fadeUpVariants (which requires `custom`
 * for delay) but never passed `custom`. Fixed by using a separate
 * staggerChildVariants that has a fixed transition — delay is handled
 * by the staggerChildren on the parent container.
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

/** Child variant — no custom delay needed; parent stagger controls timing */
export const staggerChildVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
}

/** Page-level fade-up for route transitions */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: "easeIn" },
  },
}

// ── Components ─────────────────────────────────────────────

interface MotionDivProps extends HTMLMotionProps<"div"> {
  delay?: number
  once?: boolean
}

/**
 * Scroll-triggered fade-up wrapper.
 * Uses `custom={delay}` correctly with fadeUpVariants.
 */
export function MotionDiv({
  children,
  delay = 0,
  once = true,
  variants = fadeUpVariants,
  ...props
}: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={variants}
      custom={delay}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger container — orchestrates children via staggerChildren.
 * Children should use MotionItem (not MotionDiv) to avoid custom-prop mismatch.
 */
export function MotionList({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * FIX #5: Uses staggerChildVariants (fixed transition, no custom prop needed).
 * Timing is controlled by parent MotionList staggerChildren.
 */
export function MotionItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={staggerChildVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/** Wrapper for page-level route transition — used in layout.tsx */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
