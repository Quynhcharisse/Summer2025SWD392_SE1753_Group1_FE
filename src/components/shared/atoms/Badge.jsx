import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };  // Variant styles - theme aware for all themes
  const variantClasses = {
    default: 'bg-theme-surface theme-aware-text-secondary border theme-aware-border',
    primary: 'bg-theme-primary-10 text-theme-primary border border-theme-primary border-opacity-30',
    secondary: 'bg-theme-secondary-10 text-theme-secondary border border-theme-secondary border-opacity-30',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-theme-info-10 text-theme-info border border-theme-info border-opacity-30'
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentVariant = variantClasses[variant] || variantClasses.default;

  return (
    <span
      className={`${baseClasses} ${currentSize} ${currentVariant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Badge;
