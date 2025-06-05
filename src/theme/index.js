import { colors, themes, componentColors, themeClasses } from './colors.js';

/**
 * Main Theme Configuration
 * Central theme management for the Preschool UI application
 */

// Re-export all theme elements for easier imports
export { colors, themes, componentColors, themeClasses };

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Typography scale
export const typography = {
  fontFamily: {
    primary: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Poppins', 'system-ui', 'sans-serif'],
    kid: ['Comic Sans MS', 'cursive']
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }]
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  }
};

// Spacing scale
export const spacing = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem'
};

// Border radius scale
export const borderRadius = {
  none: '0px',
  sm: '0.125rem',
  default: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  '4xl': '2rem',
  '5xl': '2.5rem',
  full: '9999px'
};

// Shadow scale
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.04)',
  strong: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
  playful: '0 8px 30px rgba(59, 130, 246, 0.15)'
};

// Animation timings
export const animations = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms'
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800
};

// Theme variants for different contexts
export const themePresets = {
  default: {
    name: 'Default',
    colors: themes.light,
    isDark: false
  },
  dark: {
    name: 'Dark',
    colors: themes.dark,
    isDark: true
  },
  playful: {
    name: 'Playful',
    colors: themes.playful,
    isDark: false
  }
};

// Component size variants
export const sizes = {
  xs: {
    padding: '0.25rem 0.5rem',
    fontSize: 'text-xs',
    borderRadius: 'rounded',
    height: 'h-6'
  },
  sm: {
    padding: '0.375rem 0.75rem',
    fontSize: 'text-sm',
    borderRadius: 'rounded-md',
    height: 'h-8'
  },
  md: {
    padding: '0.5rem 1rem',
    fontSize: 'text-base',
    borderRadius: 'rounded-lg',
    height: 'h-10'
  },
  lg: {
    padding: '0.75rem 1.5rem',
    fontSize: 'text-lg',
    borderRadius: 'rounded-lg',
    height: 'h-12'
  },
  xl: {
    padding: '1rem 2rem',
    fontSize: 'text-xl',
    borderRadius: 'rounded-xl',
    height: 'h-14'
  }
};

// Main theme object
export const theme = {
  colors,
  themes,
  componentColors,
  breakpoints,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  zIndex,
  themePresets,
  sizes
};

// Utility functions for theme usage
export const getThemeColor = (colorPath, theme = 'light') => {
  const paths = colorPath.split('.');
  let color = themes[theme];
  
  for (const path of paths) {
    color = color?.[path];
  }
  
  return color || colorPath;
};

export const getComponentColor = (component, variant = 'default', property = 'bg') => {
  return componentColors[component]?.[variant]?.[property] || colors.neutral.gray[500];
};
