import { cn } from "@/lib/utils"
import { MotionDiv } from "./motion-div"

interface SectionHeaderProps {
  eyebrow: string
  title: React.ReactNode
  description?: string
  light?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <MotionDiv delay={0}>
        <span
          className={cn(
            "block text-xs font-semibold uppercase tracking-[0.12em] mb-3",
            light ? "text-white/50" : "text-accent"
          )}
        >
          {eyebrow}
        </span>
      </MotionDiv>
      <MotionDiv delay={0.08}>
        <h2
          className={cn(
            "font-display font-bold leading-tight tracking-tight",
            "text-3xl sm:text-4xl lg:text-[2.75rem]",
            light ? "text-white" : "text-navy"
          )}
        >
          {title}
        </h2>
      </MotionDiv>
      {description && (
        <MotionDiv delay={0.16}>
          <p
            className={cn(
              "mt-4 text-base leading-relaxed",
              light ? "text-white/60" : "text-brand-gray"
            )}
          >
            {description}
          </p>
        </MotionDiv>
      )}
    </div>
  )
}
