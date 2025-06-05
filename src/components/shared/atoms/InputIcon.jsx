import React from 'react';
import PropTypes from 'prop-types';

const InputIcon = ({
  icon: Icon,
  position = 'left',
  size = 'md',
  color = 'gray',
  className = '',
  onClick,
  disabled = false,
  ...props
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Color variants
  const colorClasses = {
    gray: 'text-gray-400',
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500'
  };

  // Position classes
  const positionClasses = {
    left: 'left-0 pl-3',
    right: 'right-0 pr-3'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentColor = colorClasses[color] || colorClasses.gray;
  const currentPosition = positionClasses[position] || positionClasses.left;

  const iconClasses = `
    ${currentSize}
    ${currentColor}
    ${disabled ? 'opacity-50' : ''}
    ${onClick && !disabled ? 'cursor-pointer hover:text-opacity-80' : ''}
    ${className}
  `;

  if (!Icon) {
    return null;
  }

  return (
    <div className={`absolute inset-y-0 ${currentPosition} flex items-center ${onClick && !disabled ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <Icon
        className={iconClasses}
        onClick={onClick && !disabled ? onClick : undefined}
        {...props}
      />
    </div>
  );
};

InputIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  position: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['gray', 'blue', 'green', 'red', 'yellow', 'purple']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default InputIcon;
