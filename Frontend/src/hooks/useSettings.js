import { useSettings as useSettingsContext } from '../contexts/SettingsContext';
import { useEffect } from 'react';

/**
 * Enhanced settings hook with additional utilities
 */
export const useSettings = () => {
  const { settings, updateSettings, resetSettings, getSetting } = useSettingsContext();

  // Apply typography settings to CSS
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size
    root.style.setProperty('--user-font-size', `${settings.typography.fontSize}px`);
    
    // Apply line height
    root.style.setProperty('--user-line-height', settings.typography.lineHeight);
    
    // Apply font family
    let fontFamily = 'var(--font-family)';
    if (settings.typography.fontFamily === 'mono') {
      fontFamily = 'var(--font-family-mono)';
    } else if (settings.typography.fontFamily === 'serif') {
      fontFamily = 'Georgia, serif';
    }
    root.style.setProperty('--user-font-family', fontFamily);
    
  }, [settings.typography]);

  // Apply layout settings to CSS
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply sidebar width
    root.style.setProperty('--sidebar-width', `${settings.layout.sidebarWidth}px`);
    
    // Apply message spacing
    let spacing = 'var(--spacing-md)';
    if (settings.layout.messageSpacing === 'compact') {
      spacing = 'var(--spacing-sm)';
    } else if (settings.layout.messageSpacing === 'spacious') {
      spacing = 'var(--spacing-lg)';
    }
    root.style.setProperty('--message-spacing', spacing);
    
  }, [settings.layout]);

  // Utility functions
  const toggleSetting = (path) => {
    const currentValue = getSetting(path);
    updateSettings(path, !currentValue);
  };

  const incrementSetting = (path, increment = 1, min, max) => {
    const currentValue = getSetting(path);
    let newValue = currentValue + increment;
    
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;
    
    updateSettings(path, newValue);
  };

  const getMessageSpacingClass = () => {
    return `message-spacing-${settings.layout.messageSpacing}`;
  };

  const shouldShowTimestamps = () => {
    return settings.layout.showTimestamps;
  };

  const shouldAutoScroll = () => {
    return settings.behavior.autoScroll;
  };

  const areKeyboardShortcutsEnabled = () => {
    return settings.behavior.keyboardShortcuts;
  };

  const shouldPlaySounds = () => {
    return settings.behavior.soundNotifications;
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    getSetting,
    toggleSetting,
    incrementSetting,
    getMessageSpacingClass,
    shouldShowTimestamps,
    shouldAutoScroll,
    areKeyboardShortcutsEnabled,
    shouldPlaySounds
  };
};