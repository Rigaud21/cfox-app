import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('cfox-theme')
    return saved ? saved === 'dark' : true
  })

  // Apply/remove light-mode on <html> so every page gets it
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light-mode')
    } else {
      document.documentElement.classList.add('light-mode')
    }
  }, [darkMode])

  const toggleDarkMode = useCallback(() => {
    document.documentElement.classList.add('theme-transitioning')
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 350)
    setDarkMode(prev => {
      const next = !prev
      localStorage.setItem('cfox-theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
