import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button, Badge } from '@atoms';

/**
 * EventCard - A reusable card component for displaying event information
 * 
 * Features:
 * - Multiple variants (default, featured, compact)
 * - Event details display (date, time, location)
 * - Category badge support
 * - Action buttons
 * - Responsive design
 */
const EventCard = ({
  event,
  variant = 'default',
  onAction,
  actionLabel = 'Learn More',
  className = '',
  showCategory = true,
  showDescription = true,
  showLocation = true
}) => {
  const {
    title,
    description,
    date,
    time,
    location,
    category,
    color = 'blue',
    featured = false
  } = event;

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-50 to-blue-100 border-blue-200',
      green: 'from-green-50 to-green-100 border-green-200',
      purple: 'from-purple-50 to-purple-100 border-purple-200',
      orange: 'from-orange-50 to-orange-100 border-orange-200',
      pink: 'from-pink-50 to-pink-100 border-pink-200',
      yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
    };
    return colorMap[color] || colorMap.blue;
  };

  const getBadgeColor = (category) => {
    const categoryColors = {
      Festival: 'primary',
      Academic: 'success',
      Arts: 'secondary',
      Sports: 'warning',
      Ceremony: 'info'
    };
    return categoryColors[category] || 'secondary';
  };

  const baseClasses = `bg-gradient-to-br rounded-lg border ${getColorClasses(color)}`;
  
  const variantClasses = {
    default: 'p-4',
    featured: 'p-6 border-2',
    compact: 'p-3'
  };

  const titleClasses = {
    default: 'text-lg font-semibold',
    featured: 'text-xl font-semibold',
    compact: 'text-base font-semibold'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Header with badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2">
          {showCategory && category && (
            <Badge 
              variant={getBadgeColor(category)} 
              size={variant === 'compact' ? 'sm' : 'md'}
            >
              {category}
            </Badge>
          )}
          {featured && variant !== 'compact' && (
            <Badge variant="warning" size="sm">
              Featured
            </Badge>
          )}
        </div>
        
        {variant === 'featured' && (
          <div className="text-sm text-gray-600">
            <div className="flex items-center mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              {date}
            </div>
            {time && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {time}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event details for non-featured variants */}
      {variant !== 'featured' && (
        <div className="text-sm text-gray-600 mb-2">
          <div className="flex items-center mb-1">
            <Calendar className="h-3 w-3 mr-1" />
            {date}
          </div>
          {time && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {time}
            </div>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className={`${titleClasses[variant]} text-gray-900 mb-2`}>
        {title}
      </h3>

      {/* Description */}
      {showDescription && description && (
        <p className={`text-gray-600 mb-3 ${
          variant === 'compact' ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'
        }`}>
          {description}
        </p>
      )}

      {/* Location */}
      {showLocation && location && (
        <div className={`flex items-center text-gray-600 mb-3 ${
          variant === 'compact' ? 'mb-2' : 'mb-3'
        }`}>
          <MapPin className={`mr-1 ${variant === 'compact' ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className={variant === 'compact' ? 'text-xs' : 'text-sm'}>
            {location}
          </span>
        </div>
      )}

      {/* Action button */}
      {variant === 'featured' ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => onAction?.(event)}
          >
            {actionLabel}
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onAction?.(event)}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

EventCard.propTypes = {
  /** Event object containing event details */
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    time: PropTypes.string,
    location: PropTypes.string,
    category: PropTypes.string,
    color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'pink', 'yellow']),
    featured: PropTypes.bool
  }).isRequired,
  /** Visual variant of the card */
  variant: PropTypes.oneOf(['default', 'featured', 'compact']),
  /** Function called when action button is clicked */
  onAction: PropTypes.func,
  /** Label for the action button */
  actionLabel: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Whether to show category badge */
  showCategory: PropTypes.bool,
  /** Whether to show event description */
  showDescription: PropTypes.bool,
  /** Whether to show event location */
  showLocation: PropTypes.bool
};

export default EventCard;
