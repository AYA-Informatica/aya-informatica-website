"use client"

import { useState, useEffect } from "react"

/**
 * Returns true when window.scrollY exceeds `threshold` pixels.
 * Used by Navbar to switch from transparent → solid.
 */
export function useScrolled(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > threshold)
    check()
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [threshold])

  return scrolled
}
