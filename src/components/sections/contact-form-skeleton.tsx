import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton"

/**
 * Suspense fallback for the contact form.
 *
 * The form reads search params, so it suspends on first render. Without a
 * fallback the whole card was simply absent until it resolved, collapsing the
 * page. This mirrors the form's field layout so the card holds its height.
 */
export function ContactFormSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion
      label={label}
      className="bg-surface-raised rounded-2xl border border-border-subtle p-5 sm:p-7 md:p-9"
    >
      {/* title + required-fields note */}
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-3 w-28 mt-3 mb-7" />

      <div className="flex flex-col gap-5">
        {/* name + email, then phone + subject */}
        {[0, 1].map((row) => (
          <div key={row} className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
            {[0, 1].map((col) => (
              <div key={col} className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ))}

        {/* message */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>

        {/* submit row */}
        <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center gap-4">
          <Skeleton className="h-11 w-full min-[480px]:w-40 rounded-lg" />
          <Skeleton className="h-3.5 w-48" />
        </div>
      </div>
    </SkeletonRegion>
  )
}
