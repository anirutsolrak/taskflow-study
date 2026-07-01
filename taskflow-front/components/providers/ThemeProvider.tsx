"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
  setLight: () => void
  setDark: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "catnotes-theme"

function temaInicial(): Theme {
  if (typeof document === "undefined") return "light"
  const atual = document.documentElement.getAttribute("data-theme")
  return atual === "dark" ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignora storage indisponivel */
    }
  }, [theme])

  const value: ThemeContextValue = {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    setLight: () => setTheme("light"),
    setDark: () => setTheme("dark"),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme precisa estar dentro de <ThemeProvider>")
  return ctx
}
