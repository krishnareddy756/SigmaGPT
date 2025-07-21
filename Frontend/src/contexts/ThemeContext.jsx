import { createContext, useContext, useEffect, useState } from 'react';

// Theme definitions
const themes = {
  dark: {
    mode: 'dark',
    colors: {
      primary: '#0ea5e9',
      secondary: '#64748b',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: '#334155',
      accent: '#0ea5e9',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      code: '#1e293b',
      codeText: '#e2e8f0'
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      monoFontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem'
    }
  },
  light: {
    mode: 'light',
    colors: {
      primary: '#0ea5e9',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
      accent: '#0ea5e9',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      code: '#f1f5f9',
      codeText: '#1e293b'
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      monoFontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem'
    }
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'system';
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine current theme
  const currentTheme = themeMode === 'system' ? systemTheme : themeMode;
  const theme = themes[currentTheme];

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme colors as CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply typography
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });

    // Apply font families
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    root.style.setProperty('--font-family-mono', theme.typography.monoFontFamily);

    // Add theme class to body
    document.body.className = `theme-${currentTheme}`;
  }, [theme, currentTheme]);

  const setTheme = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('theme-mode', mode);
  };

  const toggleTheme = () => {
    const newMode = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newMode);
  };

  const value = {
    theme,
    themeMode,
    currentTheme,
    setTheme,
    toggleTheme,
    systemTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};