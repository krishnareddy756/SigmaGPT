import { createContext, useContext, useEffect, useState } from 'react';

const defaultShortcuts = {
  'ctrl+n': 'newChat',
  'ctrl+f': 'search',
  'ctrl+k': 'commandPalette',
  'ctrl+/': 'showShortcuts',
  'escape': 'closeModal',
  'ctrl+enter': 'sendMessage',
  'ctrl+shift+c': 'copyCode',
  'ctrl+e': 'exportChat',
  'ctrl+d': 'deleteChat',
  'ctrl+t': 'toggleTheme',
  'ctrl+,': 'openSettings'
};

const KeyboardContext = createContext();

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
};

export const KeyboardProvider = ({ children }) => {
  const [shortcuts, setShortcuts] = useState(defaultShortcuts);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [handlers, setHandlers] = useState({});

  // Register a handler for a specific action
  const registerHandler = (action, handler) => {
    setHandlers(prev => ({
      ...prev,
      [action]: handler
    }));
  };

  // Unregister a handler
  const unregisterHandler = (action) => {
    setHandlers(prev => {
      const newHandlers = { ...prev };
      delete newHandlers[action];
      return newHandlers;
    });
  };

  // Parse keyboard event to shortcut string
  const eventToShortcut = (event) => {
    const parts = [];
    
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    
    const key = event.key.toLowerCase();
    if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
      parts.push(key);
    }
    
    return parts.join('+');
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      const shortcut = eventToShortcut(event);
      const action = shortcuts[shortcut];
      
      if (action && handlers[action]) {
        event.preventDefault();
        handlers[action](event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, handlers]);

  // Built-in handlers
  useEffect(() => {
    registerHandler('showShortcuts', () => {
      setShowShortcutsModal(true);
    });

    registerHandler('closeModal', () => {
      setShowShortcutsModal(false);
    });

    return () => {
      unregisterHandler('showShortcuts');
      unregisterHandler('closeModal');
    };
  }, []);

  const value = {
    shortcuts,
    setShortcuts,
    registerHandler,
    unregisterHandler,
    showShortcutsModal,
    setShowShortcutsModal
  };

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};