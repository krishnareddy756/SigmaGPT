import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useKeyboard } from '../contexts/KeyboardContext';
import SettingsPanel from './SettingsPanel';
import './SettingsButton.css';

const SettingsButton = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { toggleTheme, currentTheme } = useTheme();
  const { registerHandler, unregisterHandler } = useKeyboard();

  // Register keyboard shortcuts
  useEffect(() => {
    registerHandler('toggleTheme', toggleTheme);
    registerHandler('openSettings', () => setShowSettings(true));

    return () => {
      unregisterHandler('toggleTheme');
      unregisterHandler('openSettings');
    };
  }, [toggleTheme, registerHandler, unregisterHandler]);

  return (
    <>
      <div className="settings-controls">
        <button
          className="theme-toggle-button"
          onClick={toggleTheme}
          title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode (Ctrl+T)`}
        >
          {currentTheme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        <button
          className="settings-button"
          onClick={() => setShowSettings(true)}
          title="Open Settings (Ctrl+,)"
        >
          ⚙️
        </button>
      </div>

      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
};

export default SettingsButton;