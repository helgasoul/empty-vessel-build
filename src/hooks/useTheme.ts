
import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: Theme;
  compactMode: boolean;
  language: 'ru' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  compactMode: false,
  language: 'ru',
  notifications: {
    email: true,
    push: true,
    reminders: true,
  },
};

export const useTheme = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('user-preferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const updateTheme = () => {
      let theme: 'light' | 'dark' = 'light';
      
      if (preferences.theme === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        theme = preferences.theme as 'light' | 'dark';
      }
      
      setResolvedTheme(theme);
      
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      if (preferences.compactMode) {
        root.classList.add('compact');
      } else {
        root.classList.remove('compact');
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [preferences.theme, preferences.compactMode]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('user-preferences', JSON.stringify(newPreferences));
  };

  return {
    preferences,
    resolvedTheme,
    updatePreferences,
    setTheme: (theme: Theme) => updatePreferences({ theme }),
    toggleCompactMode: () => updatePreferences({ compactMode: !preferences.compactMode }),
  };
};
