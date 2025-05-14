import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("Flockly-theme") || "dark",
    setTheme: (theme) => {
        localStorage.setItem("Flockly-theme", theme)
        set({ theme })
    }
}))