"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    id: "home",
    src: "/ray/screen-home.webp",
    alt: "RAY Markets home — recent listings across Rwanda",
    label: "Recent Listings",
    sub: "Live in Rwanda",
    device: "mobile" as const,
    w: 420,
    h: 933,
  },
  {
    id: "browse",
    src: "/ray/screen-browse.webp",
    alt: "RAY Markets — browse categories",
    label: "Browse & Discover",
    sub: "15 categories",
    device: "mobile" as const,
    w: 420,
    h: 933,
  },
  {
    id: "search",
    src: "/ray/screen-search.webp",
    alt: "RAY Markets — search results",
    label: "Find Anything",
    sub: "Filter · sort · save",
    device: "mobile" as const,
    w: 420,
    h: 933,
  },
  {
    id: "sell",
    src: "/ray/screen-sell.webp",
    alt: "RAY Markets — post a listing",
    label: "Sell in Minutes",
    sub: "Free to post",
    device: "mobile" as const,
    w: 420,
    h: 933,
  },
  {
    id: "web",
    src: "/ray/screen-desktop.webp",
    alt: "RAY Markets web app on desktop",
    label: "Also on the Web",
    sub: "raymarkets.co",
    device: "desktop" as const,
    w: 900,
    h: 571,
  },
] as const

const INTERVAL = 4500

function calcDir(from: number, to: number, len: number) {
  if (to === (from + 1) % len) return 1
  if (from === (to + 1) % len) return -1
  return to > from ? 1 : -1
}

export function RaySlideshow() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)

  // 3D tilt for the phone — feels like picking it up
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateY = useSpring(useTransform(rawX, [-120, 120], [-8, 8]), {
    stiffness: 180,
    damping: 22,
  })
  const rotateX = useSpring(useTransform(rawY, [-120, 120], [6, -6]), {
    stiffness: 180,
    damping: 22,
  })

  const go = useCallback(
    (next: number) => {
      setDir(calcDir(idx, next, SLIDES.length))
      setIdx(next)
    },
    [idx],
  )
  const advance = useCallback(() => go((idx + 1) % SLIDES.length), [go, idx])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(advance, INTERVAL)
    return () => clearTimeout(t)
  }, [idx, paused, advance])

  const slide = SLIDES[idx]
  const isMobile = slide.device === "mobile"

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isMobile || !frameRef.current) return
      const rect = frameRef.current.getBoundingClientRect()
      rawX.set(e.clientX - rect.left - rect.width / 2)
      rawY.set(e.clientY - rect.top - rect.height / 2)
    },
    [isMobile, rawX, rawY],
  )

  const onMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    setPaused(false)
  }, [rawX, rawY])

  return (
    <div className="flex flex-col items-center gap-6 w-full">

      {/* Frame + glow wrapper */}
      <div
        className="relative w-full flex justify-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {/* Ambient glow — breathes with device type */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          animate={{
            width: isMobile ? 160 : 380,
            opacity: isMobile ? 0.45 : 0.18,
            scaleY: isMobile ? 1 : 0.6,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{
            height: 32,
            background: "rgb(var(--brand-accent) / 1)",
            filter: "blur(36px)",
          }}
          aria-hidden="true"
        />

        {/* Device frame — morphs between phone and laptop */}
        <motion.div
          ref={frameRef}
          layout
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className={cn(
            "relative overflow-hidden cursor-pointer mx-auto",
            isMobile
              ? [
                  "w-[280px] sm:w-[320px]",
                  "rounded-[2.8rem]",
                  "aspect-[9/20]",
                  "shadow-[0_0_0_10px_hsl(215_55%_7%),0_0_0_12px_rgb(var(--brand-accent)/0.12),0_40px_110px_rgba(0,0,0,0.68)]",
                ].join(" ")
              : [
                  "w-full",
                  "rounded-2xl",
                  "aspect-video",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_28px_80px_rgba(0,0,0,0.5),0_0_60px_rgb(var(--brand-accent)/0.06)]",
                ].join(" "),
          )}
          style={
            isMobile
              ? { perspective: 900, rotateX, rotateY }
              : { perspective: 2400 }
          }
          onClick={advance}
        >
          {/* Accent progress bar */}
          <motion.div
            key={`pb-${idx}`}
            className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: INTERVAL / 1000, ease: "linear" }}
          />

          {/* Slides */}
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={slide.id}
              className={cn(
                "absolute inset-0",
                !isMobile && "bg-neutral-100",
              )}
              custom={dir}
              variants={{
                enter: (d: number) => ({
                  x: `${d * 100}%`,
                  scale: 0.92,
                  opacity: 0.5,
                }),
                center: { x: "0%", scale: 1, opacity: 1 },
                exit: (d: number) => ({
                  x: `${d * -45}%`,
                  scale: 0.96,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className={
                  isMobile ? "object-cover object-top" : "object-contain"
                }
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 560px"
                priority={idx === 0}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Invisible tap/click zones */}
          <button
            className="absolute left-0 top-0 h-full w-1/3 z-30 opacity-0"
            onClick={(e) => {
              e.stopPropagation()
              go((idx - 1 + SLIDES.length) % SLIDES.length)
            }}
            aria-label="Previous slide"
            tabIndex={-1}
          />
          <button
            className="absolute right-0 top-0 h-full w-2/3 z-30 opacity-0"
            onClick={(e) => {
              e.stopPropagation()
              advance()
            }}
            aria-label="Next slide"
            tabIndex={-1}
          />
        </motion.div>
      </div>

      {/* Caption — slides up fresh on each change */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`cap-${idx}`}
          className="text-center leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <p className="text-[0.85rem] font-semibold text-content-strong tracking-tight">
            {slide.label}
          </p>
          <p className="text-[0.7rem] text-content-muted mt-0.5">{slide.sub}</p>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex items-center gap-2" role="tablist" aria-label="App slideshow">
        {SLIDES.map((s, i) => (
          <motion.button
            key={s.id}
            role="tab"
            aria-selected={i === idx}
            aria-label={s.label}
            onClick={() => go(i)}
            className={cn(
              "rounded-full",
              i === idx
                ? "bg-accent"
                : "bg-content/20 hover:bg-content/40",
            )}
            animate={{ width: i === idx ? 22 : 6, height: 6 }}
            transition={{ type: "spring", stiffness: 460, damping: 34 }}
          />
        ))}
      </div>
    </div>
  )
}
