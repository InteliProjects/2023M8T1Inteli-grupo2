import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'dark' | 'light';
  color: string;
  toggleTheme: () => void;
  setColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initialTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'light';
  const initialColor = localStorage.getItem('color') || '#a805a3';

  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);
  const [color, setColor] = useState<string>(initialColor);

  useEffect(() => {
    const root = document.querySelector("#root") as HTMLDivElement;
    root.className = theme;
    root.style.setProperty('--variable-color', color);
    console.log(theme);

    // Armazena o tema e a cor no LocalStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('color', color);
  }, [theme, color]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, color, toggleTheme, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}