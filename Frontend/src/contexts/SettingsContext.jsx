import { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  theme: {
    mode: 'system',
    customColors: {}
  },
  typography: {
    fontSize: 14,
    fontFamily: 'system',
    lineHeight: 1.5
  },
  layout: {
    sidebarWidth: 280,
    messageSpacing: 'comfortable',
    showTimestamps: true
  },
  behavior: {
    autoScroll: true,
    soundNotifications: false,
    keyboardShortcuts: true
  }
};

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('app-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return defaultSettings;
    }
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const updateSettings = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('app-settings');
  };

  const getSetting = (path) => {
    const keys = path.split('.');
    let current = settings;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return undefined;
      }
      current = current[key];
    }
    
    return current;
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    getSetting
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};