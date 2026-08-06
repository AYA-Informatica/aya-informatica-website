import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-border-control bg-surface px-4 py-3 text-sm font-body text-content ring-offset-background",
          "placeholder:text-content-muted",
          "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:bg-surface-raised",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y transition-all duration-150",
          "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
