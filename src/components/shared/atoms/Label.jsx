import React from 'react';
import PropTypes from 'prop-types';

const Label = ({
  children,
  htmlFor,
  required = false,
  size = 'md',
  className = '',
  ...props
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const baseClasses = 'block font-medium text-gray-700 mb-1';
  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <label
      htmlFor={htmlFor}
      className={`${baseClasses} ${currentSize} ${className}`}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Label;
