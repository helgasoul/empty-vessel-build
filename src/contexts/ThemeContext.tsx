
import React, { createContext, useContext } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeContextType {
  preferences: any;
  resolvedTheme: 'light' | 'dark';
  updatePreferences: (updates: any) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleCompactMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeUtils = useTheme();

  return (
    <ThemeContext.Provider value={themeUtils}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
