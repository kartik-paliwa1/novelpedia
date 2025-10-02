"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  onClose: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md rounded-lg border p-4 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        {
          "border-border bg-background": variant === "default",
          "border-green-200 bg-green-50 text-green-800": variant === "success",
          "border-red-200 bg-red-50 text-red-800": variant === "error",
          "border-yellow-200 bg-yellow-50 text-yellow-800": variant === "warning",
        }
      )}
    >
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        {description && (
          <div className="mt-1 text-sm opacity-90">{description}</div>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 inline-flex h-4 w-4 items-center justify-center rounded-sm opacity-70 hover:opacity-100"
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

interface ToasterProps {
  toasts: Array<{
    id: string
    title: string
    description?: string
    variant?: "default" | "success" | "error" | "warning"
  }>
  onRemoveToast: (id: string) => void
}

export function Toaster({ toasts, onRemoveToast }: ToasterProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  )
}