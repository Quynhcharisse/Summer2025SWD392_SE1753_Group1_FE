import React from 'react';
import PropTypes from 'prop-types';
import { Button, Badge } from '@atoms';

/**
 * FeatureCard - A reusable card component for displaying features, services, or benefits
 * 
 * Features:
 * - Multiple variants (default, outlined, filled)
 * - Icon support with different positions
 * - Badge support for labels or status
 * - Action button with customizable text
 * - Responsive design with different sizes
 */
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  badge,
  action,
  variant = 'default',
  size = 'md',
  iconPosition = 'top',
  iconColor = 'primary',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 hover:shadow-lg',
    outlined: 'bg-white border-2 border-gray-300 hover:border-blue-400',
    filled: 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
  };

  const iconColorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    danger: 'text-red-600'
  };

  const isHorizontal = iconPosition === 'left' || iconPosition === 'right';
  const cardClasses = `
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    rounded-lg transition-all duration-200 cursor-pointer
    ${className}
  `;
  const handleClick = () => {
    if (onClick) {
      onClick({ title, description, badge, action });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const renderIcon = () => {
    if (!Icon) return null;
    
    return (
      <div className={`
        ${iconColorClasses[iconColor]}
        ${iconPosition === 'top' ? 'mb-4 text-center' : ''}
        ${iconPosition === 'left' ? 'mr-4 flex-shrink-0' : ''}
        ${iconPosition === 'right' ? 'ml-4 flex-shrink-0' : ''}
      `}>
        <Icon className={iconSizes[size]} />
      </div>
    );
  };

  const renderContent = () => (
    <div className={`${isHorizontal ? 'flex-grow' : ''}`}>
      {/* Badge and Title */}
      <div className={`${iconPosition === 'top' ? 'text-center' : ''} mb-3`}>
        {badge && (
          <div className="mb-2">
            <Badge 
              variant={badge.variant || 'secondary'} 
              size={size === 'sm' ? 'sm' : 'md'}
            >
              {badge.text}
            </Badge>
          </div>
        )}
        
        <h3 className={`${titleSizes[size]} font-semibold text-gray-900 mb-2`}>
          {title}
        </h3>
      </div>

      {/* Description */}
      {description && (
        <p className={`
          text-gray-600 mb-4
          ${iconPosition === 'top' ? 'text-center' : ''}
          ${size === 'sm' ? 'text-sm' : 'text-base'}
        `}>
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <div className={iconPosition === 'top' ? 'text-center' : ''}>
          <Button
            variant={action.variant || 'outline'}
            size={action.size || (size === 'sm' ? 'sm' : 'md')}
            onClick={action.onClick}
            className={action.className}
          >
            {action.text}
          </Button>
        </div>
      )}
    </div>
  );  if (isHorizontal) {
    return (
      <button 
        className={`${cardClasses} text-left w-full`} 
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`${title} feature card`}
      >
        <div className={`flex items-start ${iconPosition === 'right' ? 'flex-row-reverse' : ''}`}>
          {renderIcon()}
          {renderContent()}
        </div>
      </button>
    );
  }

  return (
    <button 
      className={`${cardClasses} text-left w-full`} 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${title} feature card`}
    >
      {renderIcon()}
      {renderContent()}
    </button>
  );
};

FeatureCard.propTypes = {
  /** Icon component to display */
  icon: PropTypes.elementType,
  /** Title text */
  title: PropTypes.string.isRequired,
  /** Description text */
  description: PropTypes.string,
  /** Badge configuration */
  badge: PropTypes.shape({
    text: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger'])
  }),
  /** Action button configuration */
  action: PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string
  }),
  /** Visual variant of the card */
  variant: PropTypes.oneOf(['default', 'outlined', 'filled']),
  /** Size of the card */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Position of the icon */
  iconPosition: PropTypes.oneOf(['top', 'left', 'right']),
  /** Color of the icon */
  iconColor: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Function called when card is clicked */
  onClick: PropTypes.func
};

export default FeatureCard;
