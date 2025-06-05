import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Sun, Moon, Palette, ChevronDown } from 'lucide-react';
import { useTheme } from '@contexts/ThemeContext';

const ThemeToggle = ({ 
  variant = 'button',
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const { theme, setTheme, availableThemes, isTransitioning } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Theme configurations
  const themeConfig = {
    light: {
      name: 'Light',
      icon: Sun,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      description: 'Clean and bright theme'
    },
    dark: {
      name: 'Dark',
      icon: Moon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      description: 'Easy on the eyes'
    },
    playful: {
      name: 'Playful',
      icon: Palette,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      description: 'Colorful and fun'
    }
  };

  // Size variants
  const sizeClasses = {
    sm: {
      button: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-xs',
      dropdown: 'text-sm'
    },
    md: {
      button: 'p-2.5',
      icon: 'w-5 h-5',
      text: 'text-sm',
      dropdown: 'text-sm'
    },
    lg: {
      button: 'p-3',
      icon: 'w-6 h-6',
      text: 'text-base',
      dropdown: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];
  const currentTheme = themeConfig[theme];
  const CurrentIcon = currentTheme.icon;

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.theme-toggle-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (variant === 'simple') {
    // Simple toggle button (cycles through themes)
    return (
      <button
        onClick={() => {
          const currentIndex = availableThemes.indexOf(theme);
          const nextIndex = (currentIndex + 1) % availableThemes.length;
          setTheme(availableThemes[nextIndex]);
        }}
        disabled={isTransitioning}
        className={`
          ${currentSize.button}
          rounded-lg
          ${currentTheme.bgColor}
          ${currentTheme.color}
          transition-all duration-200
          hover:scale-105
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${className}
        `}
        title={`Switch to ${themeConfig[availableThemes[(availableThemes.indexOf(theme) + 1) % availableThemes.length]].name} theme`}
      >
        <CurrentIcon className={`${currentSize.icon} ${isTransitioning ? 'animate-spin' : ''}`} />
      </button>
    );
  }

  if (variant === 'dropdown') {
    // Dropdown selector
    return (
      <div className={`relative theme-toggle-dropdown ${className}`}>
        <button
          onClick={toggleDropdown}
          disabled={isTransitioning}
          className={`
            flex items-center gap-2 ${currentSize.button}
            bg-white border border-gray-300 rounded-lg
            hover:bg-gray-50 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${currentSize.text}
          `}
        >
          <CurrentIcon className={`${currentSize.icon} ${currentTheme.color}`} />
          {showLabel && <span>{currentTheme.name}</span>}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-1">
              {availableThemes.map((themeName) => {
                const config = themeConfig[themeName];
                const Icon = config.icon;
                const isSelected = theme === themeName;

                return (
                  <button
                    key={themeName}
                    onClick={() => handleThemeChange(themeName)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-left
                      hover:bg-gray-50 transition-colors
                      ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                      ${currentSize.dropdown}
                    `}
                  >
                    <Icon className={`${currentSize.icon} ${config.color}`} />
                    <div className="flex-1">
                      <div className="font-medium">{config.name}</div>
                      <div className="text-xs text-gray-500">{config.description}</div>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <button
      onClick={toggleDropdown}
      disabled={isTransitioning}
      className={`
        flex items-center gap-2 ${currentSize.button}
        rounded-lg
        ${currentTheme.bgColor}
        ${currentTheme.color}
        transition-all duration-200
        hover:scale-105
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      title={`Current theme: ${currentTheme.name}`}
    >
      <CurrentIcon className={`${currentSize.icon} ${isTransitioning ? 'animate-spin' : ''}`} />
      {showLabel && (
        <span className={`${currentSize.text} font-medium`}>
          {currentTheme.name}
        </span>
      )}
    </button>
  );
};

ThemeToggle.propTypes = {
  variant: PropTypes.oneOf(['button', 'simple', 'dropdown']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showLabel: PropTypes.bool,
  className: PropTypes.string
};

export default ThemeToggle;
