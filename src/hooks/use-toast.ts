"use client"

import { useState, useCallback } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
    
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((props: Omit<Toast, "id">) => {
    return addToast(props)
  }, [addToast])

  return { toasts, addToast, removeToast, toast }
}