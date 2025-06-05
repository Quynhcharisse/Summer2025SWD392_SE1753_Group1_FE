import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import { themeClasses } from '@theme/colors';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'  };  // Variant styles - using unified theme system
  const variantClasses = {
    primary: themeClasses.buttonPrimary,
    secondary: themeClasses.buttonSecondary,
    outline: themeClasses.buttonOutline,
    ghost: `bg-transparent hover:${themeClasses.backgroundSurface} ${themeClasses.textPrimary} border-transparent font-bold hover:shadow-sm`,
    danger: 'bg-red-700 hover:bg-red-800 text-white border-transparent font-bold shadow-md border-2 border-red-700',
    success: 'bg-green-700 hover:bg-green-800 text-white border-transparent font-bold shadow-md border-2 border-green-700'
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary';
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentVariant = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${currentSize}
        ${currentVariant}
        ${disabled || loading ? disabledClasses : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button;
