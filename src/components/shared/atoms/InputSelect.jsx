import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

const InputSelect = forwardRef(({
  options = [],
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  errorMessage = '',
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  // Variant styles
  const variantClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    filled: 'border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
    minimal: 'border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 focus:ring-blue-500',
  };

  const baseClasses = 'w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none';
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const disabledClasses = 'bg-gray-100 cursor-not-allowed opacity-50';

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentVariant = variantClasses[variant] || variantClasses.default;

  const selectClasses = `
    ${baseClasses}
    ${currentSize}
    ${error ? errorClasses : currentVariant}
    ${disabled ? disabledClasses : ''}
    ${className}
  `;

  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value || option} 
            value={option.value || option}
          >
            {option.label || option}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>
      
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
});

InputSelect.displayName = 'InputSelect';

InputSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired
      })
    ])
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'filled', 'minimal']),
  className: PropTypes.string
};

export default InputSelect;
