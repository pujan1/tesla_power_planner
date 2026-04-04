import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Initial setup for body class
  useEffect(() => {
    document.body.className = 'theme-dark';
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
