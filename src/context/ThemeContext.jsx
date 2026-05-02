import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ourspace-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isPoppins, setIsPoppins] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ourspace-font');
      if (saved) return saved === 'poppins';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ourspace-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (isPoppins) {
      document.documentElement.style.setProperty('--current-font', '"Poppins", sans-serif');
      document.documentElement.style.setProperty('--font-sans', '"Poppins", sans-serif');
      document.documentElement.style.setProperty('--font-serif', '"Poppins", sans-serif');
    } else {
      document.documentElement.style.removeProperty('--current-font');
      document.documentElement.style.removeProperty('--font-sans');
      document.documentElement.style.removeProperty('--font-serif');
    }
    localStorage.setItem('ourspace-font', isPoppins ? 'poppins' : 'default');
  }, [isPoppins]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleFont = () => setIsPoppins((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isPoppins, toggleFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
