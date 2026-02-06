import React from 'react';

import { getSettings, subscribeSettings, updateSettings } from '../services/progress';
import { getTheme, type AppTheme, type ThemeName } from './themes';

type ThemeContextValue = {
  theme: AppTheme;
  colors: AppTheme['colors'];
  themeName: ThemeName;
  setTheme: (name: ThemeName) => Promise<void>;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = React.useState<ThemeName>('light');

  React.useEffect(() => {
    let cancelled = false;

    getSettings()
      .then((settings) => {
        if (cancelled) return;
        setThemeName((settings.theme as ThemeName) ?? 'light');
      })
      .catch((error) => console.warn('getSettings(theme) failed', error));

    const unsubscribe = subscribeSettings((settings) => {
      setThemeName((prev) => {
        const next = (settings.theme as ThemeName) ?? 'light';
        return next === prev ? prev : next;
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const theme = React.useMemo(() => getTheme(themeName), [themeName]);

  const setTheme = React.useCallback(async (name: ThemeName) => {
    setThemeName(name);
    try {
      await updateSettings({ theme: name });
    } catch (error) {
      console.warn('updateSettings(theme) failed', error);
    }
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, colors: theme.colors, themeName, setTheme }),
    [setTheme, theme, themeName],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}

