import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  GraduationCap, 
  Calendar, 
  Users, 
  Info 
} from 'lucide-react';
import { themeClasses } from '../../../../theme/index.js';

const Navigation = ({ 
  variant = 'default',
  size = 'md',
  theme = 'light'
}) => {
  const location = useLocation();
  const navigationItems = [
    {
      id: 'home',
      label: 'HOME',
      path: '/homepage',
      icon: Home
    },
    {
      id: 'admission',
      label: 'ADMISSION',
      path: '/homepage/admission',
      icon: GraduationCap
    },
    {
      id: 'events',
      label: 'EVENTS',
      path: '/homepage/events',
      icon: Calendar
    },
    {
      id: 'classes',
      label: 'CLASSES',
      path: '/homepage/classes',
      icon: Users
    },
    {
      id: 'about',
      label: 'ABOUT US',
      path: '/homepage/about-us',
      icon: Info
    }
  ];

  // Size variants
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1',
      item: 'px-3 py-2 text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1'
    },
    md: {
      container: 'px-4 py-2',
      item: 'px-4 py-3 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2'
    },
    lg: {
      container: 'px-6 py-3',
      item: 'px-6 py-4 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2'
    }
  };  // Theme variants - using unified theme system
  const themeVariants = {
    light: {
      container: `${themeClasses.backgroundSurface} ${themeClasses.borderSecondary}`,
      item: `${themeClasses.textPrimary} hover:${themeClasses.textPrimary} hover:${themeClasses.backgroundAccent}/10`,
      activeItem: `${themeClasses.textPrimary} ${themeClasses.backgroundAccent}/10`,
      border: 'border-b'
    },
    dark: {
      container: `${themeClasses.backgroundSurface} ${themeClasses.borderSecondary}`,
      item: `${themeClasses.textPrimary} hover:${themeClasses.textPrimary} hover:${themeClasses.backgroundAccent}/10`,
      activeItem: `${themeClasses.textPrimary} ${themeClasses.backgroundAccent}/10`,
      border: 'border-b'
    },
    minimal: {
      container: 'bg-transparent',
      item: `${themeClasses.textSecondary} hover:${themeClasses.textPrimary}`,
      activeItem: `${themeClasses.textPrimary}`,
      border: ''
    }
  };

  // Variant classes
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-md',
    flat: 'shadow-none',
    bordered: 'border'
  };
  const currentSize = sizeClasses[size];
  const currentTheme = themeVariants[theme];
  const currentVariant = variantClasses[variant];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`
      w-full
      ${currentTheme.container}
      ${currentTheme.border}
      ${currentVariant}
      ${currentSize.container}
    `}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-8">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center ${currentSize.gap}
                  ${currentSize.item}
                  font-medium
                  transition-all duration-200                  border-b-2 border-transparent
                  ${active 
                    ? `${currentTheme.activeItem} border-blue-500` 
                    : `${currentTheme.item} hover:border-blue-500`
                  }
                `}
              >
                <IconComponent className={currentSize.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  variant: PropTypes.oneOf(['default', 'elevated', 'flat', 'bordered']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  theme: PropTypes.oneOf(['light', 'dark', 'minimal'])
};

export default Navigation;
