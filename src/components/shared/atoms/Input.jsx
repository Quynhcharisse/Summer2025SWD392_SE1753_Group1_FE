import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  placeholder = '',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error = false,
  errorMessage = '',
  size = 'md',
  variant = 'default',
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };  // Variant styles - theme aware với độ tương phản rất cao
  const variantClasses = {
    default: 'theme-aware-border focus:border-theme-primary focus:ring-theme-primary theme-aware-bg theme-aware-text border-2 font-medium shadow-sm',
    filled: 'theme-aware-border bg-theme-surface focus:bg-theme-background focus:border-theme-primary focus:ring-theme-primary theme-aware-text border-2 font-medium shadow-sm',
    minimal: 'border-0 border-b-2 theme-aware-border rounded-none focus:border-theme-primary focus:ring-0 focus:ring-theme-primary theme-aware-bg theme-aware-text font-medium',
  };
  const baseClasses = 'w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  const errorClasses = 'border-red-700 focus:border-red-700 focus:ring-red-700 shadow-md';
  const disabledClasses = 'bg-gray-200 cursor-not-allowed opacity-60 border-gray-400';  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentVariant = variantClasses[variant] || variantClasses.default;

  // Extract nested ternary for better readability
  let iconPadding = '';
  if (icon) {
    iconPadding = iconPosition === 'left' ? 'pl-10' : 'pr-10';
  }

  const inputClasses = `
    ${baseClasses}
    ${currentSize}
    ${error ? errorClasses : currentVariant}
    ${disabled ? disabledClasses : ''}
    ${iconPadding}
    ${className}
  `;

  return (
    <div className="relative">
      {icon && (
        <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
          {icon}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'filled', 'minimal']),
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export default Input;
