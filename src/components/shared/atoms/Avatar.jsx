import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({
  src,
  alt = '',
  size = 'md',
  shape = 'circle',
  fallback,
  className = '',
  ...props
}) => {
  // Size variants
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  // Shape variants
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-md',
    none: 'rounded-none'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentShape = shapeClasses[shape] || shapeClasses.circle;

  const baseClasses = 'inline-flex items-center justify-center bg-gray-200 text-gray-500 font-medium overflow-hidden';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${baseClasses} ${currentSize} ${currentShape} ${className}`}
        {...props}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} ${currentSize} ${currentShape} ${className}`}
      {...props}
    >
      {fallback || alt.charAt(0).toUpperCase()}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  shape: PropTypes.oneOf(['circle', 'square', 'none']),
  fallback: PropTypes.node,
  className: PropTypes.string
};

export default Avatar;
