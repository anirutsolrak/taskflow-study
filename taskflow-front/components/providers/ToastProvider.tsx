"use client"

import { createContext, useContext, useRef, useState } from "react"
import Toast from "@/components/Toast"

interface ToastContextValue {
  showToast: (mensagem: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [mensagem, setMensagem] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(msg: string) {
    setMensagem(msg)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setMensagem(null), 2200)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast mensagem={mensagem} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>")
  return ctx
}
