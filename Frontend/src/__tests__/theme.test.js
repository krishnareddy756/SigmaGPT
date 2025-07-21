// Basic theme system tests
import { 
  getSystemTheme, 
  getContrastingTextColor, 
  validateTheme, 
  mergeThemes 
} from '../utils/theme';

// Mock window.matchMedia for testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query.includes('dark'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Theme Utilities', () => {
  describe('getSystemTheme', () => {
    it('should return dark when system prefers dark mode', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });
      expect(getSystemTheme()).toBe('dark');
    });

    it('should return light when system prefers light mode', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: false });
      expect(getSystemTheme()).toBe('light');
    });
  });

  describe('getContrastingTextColor', () => {
    it('should return dark for light backgrounds', () => {
      expect(getContrastingTextColor('#ffffff')).toBe('dark');
      expect(getContrastingTextColor('#f8fafc')).toBe('dark');
    });

    it('should return light for dark backgrounds', () => {
      expect(getContrastingTextColor('#000000')).toBe('light');
      expect(getContrastingTextColor('#0f172a')).toBe('light');
    });
  });

  describe('validateTheme', () => {
    const validTheme = {
      mode: 'dark',
      colors: {
        primary: '#0ea5e9',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
        border: '#334155'
      },
      typography: {},
      spacing: {},
      borderRadius: {}
    };

    it('should return true for valid theme', () => {
      expect(validateTheme(validTheme)).toBe(true);
    });

    it('should return false for invalid theme', () => {
      const invalidTheme = { mode: 'dark' };
      expect(validateTheme(invalidTheme)).toBe(false);
    });
  });

  describe('mergeThemes', () => {
    const baseTheme = {
      colors: { primary: '#blue', secondary: '#gray' },
      spacing: { sm: '0.5rem' }
    };

    const customTheme = {
      colors: { primary: '#red' },
      typography: { fontSize: '16px' }
    };

    it('should merge themes correctly', () => {
      const merged = mergeThemes(baseTheme, customTheme);
      
      expect(merged.colors.primary).toBe('#red');
      expect(merged.colors.secondary).toBe('#gray');
      expect(merged.typography.fontSize).toBe('16px');
      expect(merged.spacing.sm).toBe('0.5rem');
    });
  });
});