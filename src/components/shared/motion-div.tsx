"use client"

import { type ReactNode } from "react"
import { useReducedMotion, motion, type Variants, type HTMLMotionProps } from "framer-motion"

// ── Variants ───────────────────────────────────────────────

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

export const pageWrapperVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ── Components ─────────────────────────────────────────────

interface MotionDivProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  delay?: number
  once?: boolean
}

export function MotionDiv({
  children,
  delay = 0,
  once = true,
  variants = fadeUpVariants,
  className,
  ...props
}: MotionDivProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={variants}
      custom={delay}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface MotionContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  className?: string
}

export function MotionList({
  children,
  className,
  ...props
}: MotionContainerProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

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

export function MotionItem({
  children,
  className,
  ...props
}: MotionContainerProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

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
