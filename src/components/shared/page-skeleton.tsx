import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * Loading placeholder shaped like the site's page template.
 *
 * The hero's spacing classes are copied from the real pages rather than
 * approximated, so the placeholder occupies the same vertical space the content
 * will — the point of a skeleton is that nothing jumps when it is replaced.
 */
export function PageSkeleton({
  label,
  /** Card count for the section beneath the hero. */
  cards = 3,
  className,
}: {
  label: string
  cards?: number
  className?: string
}) {
  return (
    <SkeletonRegion label={label} className={cn("block", className)}>
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-surface-inverse py-24 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          {/* eyebrow */}
          <Skeleton onInverse className="h-3 w-28 rounded-full" />
          {/* headline, two lines */}
          <Skeleton onInverse className="h-12 sm:h-16 w-[min(28rem,85%)] mt-5" />
          <Skeleton onInverse className="h-12 sm:h-16 w-[min(20rem,65%)] mt-3" />
          {/* sub-paragraph */}
          <div className="mt-6 flex flex-col gap-2.5 max-w-xl">
            <Skeleton onInverse className="h-4 w-full" />
            <Skeleton onInverse className="h-4 w-[92%]" />
            <Skeleton onInverse className="h-4 w-[70%]" />
          </div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────── */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="container">
          {/* section header */}
          <div className="flex flex-col items-center gap-3 mb-12">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-8 w-[min(22rem,80%)]" />
            <Skeleton className="h-4 w-[min(32rem,90%)]" />
          </div>

          {/* card grid */}
          <div
            className={cn(
              "grid grid-cols-1 gap-5",
              cards >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            )}
          >
            {Array.from({ length: cards }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-raised rounded-2xl p-7 border border-border-subtle flex flex-col gap-4"
              >
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-5 w-2/3" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-[88%]" />
                  <Skeleton className="h-3.5 w-[60%]" />
                </div>
                <Skeleton className="h-3.5 w-24 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </SkeletonRegion>
  )
}
