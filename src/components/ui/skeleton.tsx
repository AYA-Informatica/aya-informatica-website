import { cn } from "@/lib/utils"

/**
 * Placeholder block used to sketch a page's shape while it loads.
 *
 * `motion-safe:` follows the convention used elsewhere in the app, so the pulse
 * is dropped entirely for visitors who have asked for reduced motion — they
 * still get the layout, just without the animation.
 *
 * Skeletons are decorative: the surrounding region carries the status role and
 * accessible label, and every block here is hidden from assistive tech.
 */
export function Skeleton({
  className,
  onInverse = false,
}: {
  className?: string
  /** Light-on-dark treatment, for placeholders sitting on the navy bands. */
  onInverse?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-md motion-safe:animate-pulse",
        onInverse ? "bg-white/10" : "bg-content/8",
        className
      )}
    />
  )
}

/**
 * Wrapper that announces a loading region once, rather than letting each
 * individual placeholder be announced.
 */
export function SkeletonRegion({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      {children}
      <span className="sr-only">{label}</span>
    </div>
  )
}
