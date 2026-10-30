import { useEffect, useState } from "react"
import { SunIcon, MoonIcon } from "./Icons"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme")
      if (stored === "dark" || stored === "light") return stored
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <button
      type="button"
      aria-label="切换浅色或深色模式"
      onClick={toggleTheme}
      className="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 size-8 rounded-full cursor-pointer"
    >
      <SunIcon className="hidden dark:block size-4" />
      <MoonIcon className="dark:hidden size-4" />
    </button>
  )
}
