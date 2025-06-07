import React from 'react';
import PropTypes from 'prop-types';

const AuthLayout = ({ 
  children,
  title,
  subtitle,
  showLogo = true,
  logoSrc = '/SUNSHINE.png',
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Logo and Header */}
        <div className="text-center">
          {showLogo && (
            <div className="flex justify-center mb-6">
              <img
                src={logoSrc}
                alt="Sunshine Preschool"
                className="h-16 w-auto"
              />
            </div>
          )}
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        {/* Auth Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {children}
        </div>
        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          © 2025 Sunshine Preschool. All rights reserved.
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showLogo: PropTypes.bool,
  logoSrc: PropTypes.string,
  className: PropTypes.string
};

export default AuthLayout;
