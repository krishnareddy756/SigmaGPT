/**
 * Utility functions for localStorage operations with error handling
 */

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Parsed value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage with JSON stringification
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - Success status
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all localStorage items
 * @returns {boolean} - Success status
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get storage usage information
 * @returns {Object} - Storage usage stats
 */
export const getStorageInfo = () => {
  try {
    let totalSize = 0;
    const items = {};
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        items[key] = size;
        totalSize += size;
      }
    }
    
    return {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      itemCount: Object.keys(items).length,
      items
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

/**
 * Format bytes to human readable format
 * @param {number} bytes - Bytes to format
 * @returns {string} - Formatted string
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if localStorage is available
 * @returns {boolean} - Availability status
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Migrate old storage format to new format
 * @param {Object} migrations - Migration functions
 */
export const migrateStorage = (migrations) => {
  try {
    const version = getStorageItem('storage_version', 0);
    
    Object.keys(migrations).forEach(targetVersion => {
      if (version < parseInt(targetVersion)) {
        console.log(`Migrating storage to version ${targetVersion}`);
        migrations[targetVersion]();
        setStorageItem('storage_version', parseInt(targetVersion));
      }
    });
  } catch (error) {
    console.error('Error during storage migration:', error);
  }
};