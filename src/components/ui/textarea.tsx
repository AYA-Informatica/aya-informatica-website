import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-brand-gray-light bg-brand-bg px-4 py-3 text-sm font-body text-brand-dark ring-offset-background",
          "placeholder:text-brand-gray",
          "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:bg-white",
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
