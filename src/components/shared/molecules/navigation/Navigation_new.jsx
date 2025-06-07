// filepath: e:\Summer-2025\SWD\preschool-ui-swd392\src\components\shared\molecules\navigation\Navigation.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  GraduationCap, 
  Calendar, 
  Users, 
  Info,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';
import { themeClasses } from '../../../../theme/index.js';
import { useAuth } from '../../../../hooks/useAuth.js';
import { AUTH_ROUTES, getDashboardRoute } from '../../../../constants/routes.js';
import { Button } from '../../../atoms/Button.jsx';

const Navigation = ({ 
  variant = 'default',
  size = 'md',
  theme = 'light'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, authenticated, loading } = useAuth();

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
    },
    {
      id: 'contact',
      label: 'CONTACT',
      path: '/homepage/contact',
      icon: Info
    },
    {
      id: 'book-story-demo',
      label: 'BOOK STORY DEMO',
      path: '/demo/book-story',
      icon: Info
    },
    {
      id: 'theme-test',
      label: 'THEME TEST',
      path: '/demo/theme-test',
      icon: Info
    }
  ];

  // Size variants
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1',
      item: 'px-3 py-2 text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1',
      button: 'text-xs px-2 py-1'
    },
    md: {
      container: 'px-4 py-2',
      item: 'px-4 py-3 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
      button: 'text-sm px-3 py-2'
    },
    lg: {
      container: 'px-6 py-3',
      item: 'px-6 py-4 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2',
      button: 'text-base px-4 py-2'
    }
  };

  // Theme variants - using unified theme system
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

  const handleProfileClick = () => {
    if (user && user.role) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute);
    }
  };

  const handleSignInClick = () => {
    navigate(AUTH_ROUTES.LOGIN);
  };

  const handleSignUpClick = () => {
    navigate(AUTH_ROUTES.REGISTER);
  };

  if (loading) {
    return (
      <nav className={`
        w-full
        ${currentTheme.container}
        ${currentTheme.border}
        ${currentVariant}
        ${currentSize.container}
      `}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Navigation items placeholder while loading */}
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`
      w-full
      ${currentTheme.container}
      ${currentTheme.border}
      ${currentVariant}
      ${currentSize.container}
    `}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
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
                    transition-all duration-200
                    border-b-2 border-transparent
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

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-3">
            {!authenticated ? (
              <>
                <Button
                  onClick={handleSignInClick}
                  variant="outline"
                  size={size}
                  className={`flex items-center ${currentSize.gap} ${currentSize.button}`}
                >
                  <LogIn className={currentSize.icon} />
                  <span>Sign In</span>
                </Button>
                <Button
                  onClick={handleSignUpClick}
                  variant="solid"
                  size={size}
                  className={`flex items-center ${currentSize.gap} ${currentSize.button} bg-blue-600 hover:bg-blue-700 text-white`}
                >
                  <UserPlus className={currentSize.icon} />
                  <span>Sign Up</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={handleProfileClick}
                variant="solid"
                size={size}
                className={`flex items-center ${currentSize.gap} ${currentSize.button} bg-green-600 hover:bg-green-700 text-white`}
              >
                <User className={currentSize.icon} />
                <span>My SunShine Profile</span>
              </Button>
            )}
          </div>
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
