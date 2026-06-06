"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, AlertCircle, Info } from "lucide-react"
import { useToastStore } from "@/store/toast"

/** Global Toaster — mounted once in layout.tsx */
export function Toaster() {
  const { toasts } = useToastStore()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, variant }) => (
        <Toast key={id} variant={variant}>
          <div className="flex items-start gap-3 flex-1">
            {variant === "success" && (
              <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
            )}
            {variant === "destructive" && (
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            )}
            {(!variant || variant === "default") && (
              <Info size={16} className="text-accent shrink-0 mt-0.5" />
            )}
            <div className="flex flex-col gap-0.5">
              <ToastTitle>{title}</ToastTitle>
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
