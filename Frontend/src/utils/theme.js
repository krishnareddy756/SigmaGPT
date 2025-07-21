// Theme utility functions

/**
 * Get CSS custom property value
 * @param {string} property - CSS custom property name (without --)
 * @returns {string} - CSS property value
 */
export const getCSSVariable = (property) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${property}`)
    .trim();
};

/**
 * Set CSS custom property value
 * @param {string} property - CSS custom property name (without --)
 * @param {string} value - CSS property value
 */
export const setCSSVariable = (property, value) => {
  document.documentElement.style.setProperty(`--${property}`, value);
};

/**
 * Apply theme colors to CSS custom properties
 * @param {Object} colors - Theme colors object
 */
export const applyThemeColors = (colors) => {
  Object.entries(colors).forEach(([key, value]) => {
    setCSSVariable(`color-${key}`, value);
  });
};

/**
 * Get system theme preference
 * @returns {string} - 'dark' or 'light'
 */
export const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Create a media query listener for system theme changes
 * @param {Function} callback - Callback function to execute on theme change
 * @returns {Function} - Cleanup function to remove listener
 */
export const createSystemThemeListener = (callback) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e) => callback(e.matches ? 'dark' : 'light');
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => mediaQuery.removeEventListener('change', handleChange);
};

/**
 * Generate contrasting text color based on background
 * @param {string} backgroundColor - Background color in hex format
 * @returns {string} - 'light' or 'dark'
 */
export const getContrastingTextColor = (backgroundColor) => {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? 'dark' : 'light';
};

/**
 * Validate theme object structure
 * @param {Object} theme - Theme object to validate
 * @returns {boolean} - True if valid theme structure
 */
export const validateTheme = (theme) => {
  const requiredKeys = ['mode', 'colors', 'typography', 'spacing', 'borderRadius'];
  const requiredColors = ['primary', 'background', 'surface', 'text', 'border'];
  
  // Check top-level keys
  if (!requiredKeys.every(key => key in theme)) {
    return false;
  }
  
  // Check required colors
  if (!requiredColors.every(color => color in theme.colors)) {
    return false;
  }
  
  return true;
};

/**
 * Merge theme objects with deep merge for nested properties
 * @param {Object} baseTheme - Base theme object
 * @param {Object} customTheme - Custom theme overrides
 * @returns {Object} - Merged theme object
 */
export const mergeThemes = (baseTheme, customTheme) => {
  const merged = { ...baseTheme };
  
  Object.keys(customTheme).forEach(key => {
    if (typeof customTheme[key] === 'object' && !Array.isArray(customTheme[key])) {
      merged[key] = { ...merged[key], ...customTheme[key] };
    } else {
      merged[key] = customTheme[key];
    }
  });
  
  return merged;
};