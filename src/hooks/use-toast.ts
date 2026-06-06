"use client"

import { useState, useCallback } from "react"

export type ToastVariant = "default" | "success" | "destructive"

export interface ToastData {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

/** Simple toast state hook — used with the Toaster provider in layout */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 4000 }: Omit<ToastData, "id">) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, title, description, variant, duration }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
