"use client"

import { createContext, useContext, useSyncExternalStore } from "react"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
  setLight: () => void
  setDark: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "catnotes-theme"
const listeners = new Set<() => void>()

// Fonte da verdade no cliente = atributo data-theme no <html>
// (definido pelo script anti-flash antes da hidratacao e atualizado aqui).
function lerTema(): Theme {
  if (typeof document === "undefined") return "light"
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

function aplicarTema(t: Theme) {
  if (typeof document !== "undefined") document.documentElement.dataset.theme = t
  try {
    localStorage.setItem(STORAGE_KEY, t)
  } catch {
    /* storage indisponivel */
  }
  listeners.forEach((cb) => cb())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // getServerSnapshot ("light") e usado no SSR e na hidratacao inicial,
  // entao servidor e cliente batem; depois troca para o valor real.
  const theme = useSyncExternalStore(subscribe, lerTema, (): Theme => "light")

  const value: ThemeContextValue = {
    theme,
    toggle: () => aplicarTema(theme === "dark" ? "light" : "dark"),
    setLight: () => aplicarTema("light"),
    setDark: () => aplicarTema("dark"),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme precisa estar dentro de <ThemeProvider>")
  return ctx
}
