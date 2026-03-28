import { atom } from "jotai"

export type Theme = "dark" | "light"

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "dark"
    const saved = localStorage.getItem("alpha-desk-theme")
    return saved === "light" ? "light" : "dark"
}

export const themeAtom = atom<Theme>(getInitialTheme())
