import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import './SettingsPanel.css';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { themeMode, setTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  if (!isOpen) return null;

  const handleSettingChange = (path, value) => {
    updateSettings(path, value);
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'typography', label: 'Typography', icon: '📝' },
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'behavior', label: 'Behavior', icon: '⚙️' }
  ];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="settings-body">
            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h3>Theme</h3>
                <div className="setting-group">
                  <label>Color Scheme</label>
                  <div className="theme-options">
                    <button
                      className={`theme-option ${themeMode === 'light' ? 'active' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      ☀️ Light
                    </button>
                    <button
                      className={`theme-option ${themeMode === 'dark' ? 'active' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      🌙 Dark
                    </button>
                    <button
                      className={`theme-option ${themeMode === 'system' ? 'active' : ''}`}
                      onClick={() => setTheme('system')}
                    >
                      💻 System
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="settings-section">
                <h3>Typography</h3>
                <div className="setting-group">
                  <label htmlFor="fontSize">Font Size</label>
                  <input
                    id="fontSize"
                    type="range"
                    min="12"
                    max="20"
                    value={settings.typography.fontSize}
                    onChange={(e) => handleSettingChange('typography.fontSize', parseInt(e.target.value))}
                  />
                  <span className="setting-value">{settings.typography.fontSize}px</span>
                </div>

                <div className="setting-group">
                  <label htmlFor="fontFamily">Font Family</label>
                  <select
                    id="fontFamily"
                    value={settings.typography.fontFamily}
                    onChange={(e) => handleSettingChange('typography.fontFamily', e.target.value)}
                  >
                    <option value="system">System Default</option>
                    <option value="mono">Monospace</option>
                    <option value="serif">Serif</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label htmlFor="lineHeight">Line Height</label>
                  <input
                    id="lineHeight"
                    type="range"
                    min="1.2"
                    max="2.0"
                    step="0.1"
                    value={settings.typography.lineHeight}
                    onChange={(e) => handleSettingChange('typography.lineHeight', parseFloat(e.target.value))}
                  />
                  <span className="setting-value">{settings.typography.lineHeight}</span>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="settings-section">
                <h3>Layout</h3>
                <div className="setting-group">
                  <label htmlFor="sidebarWidth">Sidebar Width</label>
                  <input
                    id="sidebarWidth"
                    type="range"
                    min="200"
                    max="400"
                    value={settings.layout.sidebarWidth}
                    onChange={(e) => handleSettingChange('layout.sidebarWidth', parseInt(e.target.value))}
                  />
                  <span className="setting-value">{settings.layout.sidebarWidth}px</span>
                </div>

                <div className="setting-group">
                  <label htmlFor="messageSpacing">Message Spacing</label>
                  <select
                    id="messageSpacing"
                    value={settings.layout.messageSpacing}
                    onChange={(e) => handleSettingChange('layout.messageSpacing', e.target.value)}
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.layout.showTimestamps}
                      onChange={(e) => handleSettingChange('layout.showTimestamps', e.target.checked)}
                    />
                    Show Timestamps
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="settings-section">
                <h3>Behavior</h3>
                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.behavior.autoScroll}
                      onChange={(e) => handleSettingChange('behavior.autoScroll', e.target.checked)}
                    />
                    Auto-scroll to new messages
                  </label>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.behavior.soundNotifications}
                      onChange={(e) => handleSettingChange('behavior.soundNotifications', e.target.checked)}
                    />
                    Sound notifications
                  </label>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.behavior.keyboardShortcuts}
                      onChange={(e) => handleSettingChange('behavior.keyboardShortcuts', e.target.checked)}
                    />
                    Enable keyboard shortcuts
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="settings-footer">
            <button className="reset-button" onClick={resetSettings}>
              Reset to Defaults
            </button>
            <button className="save-button" onClick={onClose}>
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;