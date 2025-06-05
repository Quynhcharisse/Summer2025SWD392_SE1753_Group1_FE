import React from "react";
import PropTypes from "prop-types";
import { Button, Badge } from "@atoms";

const ProgramCard = ({ 
  title, 
  subtitle,
  description,
  ages,
  capacity,
  ratio,
  schedule,
  tuition,
  features = [],
  actions = [],
  isSelected = false,
  onClick,
  className = "",
  variant = "default",
  showBadge = false,
  badgeText = "",
  badgeVariant = "primary"
}) => {  const variantClasses = {
    default: "theme-aware-bg theme-aware-border border",
    primary: "bg-theme-primary-10 border-theme-primary border",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-200",
    premium: "bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200"
  };

  const iconMap = {
    ages: "👶",
    capacity: "👥",
    ratio: "👨‍🏫",
    schedule: "🕐",
    tuition: "💰"
  };

  const formatTuition = (amount) => {
    if (typeof amount === 'string') return amount;
    return `$${amount}/month`;
  };

  return (    <div 
      className={`rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer theme-aware-text ${variantClasses[variant]} ${className} ${
        isSelected ? 'ring-2 ring-theme-primary ring-opacity-50 border-theme-primary' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
            {subtitle && (
              <p className="text-gray-600 text-sm">{subtitle}</p>
            )}
          </div>
          
          {showBadge && badgeText && (
            <Badge variant={badgeVariant} className="ml-2">
              {badgeText}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}
      </div>

      {/* Program Details */}
      <div className="px-6 pb-4">
        <div className="space-y-3">
          {ages && (
            <div className="flex items-center gap-3">
              <span className="text-lg">{iconMap.ages}</span>
              <span className="text-gray-700 text-sm">
                <span className="font-medium">Ages:</span> {ages}
              </span>
            </div>
          )}
          
          {capacity && (
            <div className="flex items-center gap-3">
              <span className="text-lg">{iconMap.capacity}</span>
              <span className="text-gray-700 text-sm">
                <span className="font-medium">Class Size:</span> {capacity}
              </span>
            </div>
          )}
          
          {ratio && (
            <div className="flex items-center gap-3">
              <span className="text-lg">{iconMap.ratio}</span>
              <span className="text-gray-700 text-sm">
                <span className="font-medium">Teacher Ratio:</span> {ratio}
              </span>
            </div>
          )}
          
          {schedule && (
            <div className="flex items-center gap-3">
              <span className="text-lg">{iconMap.schedule}</span>
              <span className="text-gray-700 text-sm">
                <span className="font-medium">Schedule:</span> {schedule}
              </span>
            </div>
          )}
          
          {tuition && (
            <div className="flex items-center gap-3">
              <span className="text-lg">{iconMap.tuition}</span>
              <span className="text-green-600 text-sm font-semibold">
                {formatTuition(tuition)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="px-6 pb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Program Highlights:</h4>          <ul className="space-y-1">
            {features.slice(0, 3).map((feature) => (
              <li key={`feature-${feature.slice(0, 20)}`} className="flex items-center gap-2 text-gray-600 text-xs">
                <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
            {features.length > 3 && (
              <li className="text-gray-500 text-xs">
                +{features.length - 3} more features
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">          <div className="flex gap-2 flex-wrap">
            {actions.map((action) => (
              <Button
                key={`action-${action.label}`}
                variant={action.variant || "primary"}
                size={action.size || "sm"}
                onClick={action.onClick}
                className={`${action.className || ''} ${
                  actions.length === 1 ? 'w-full' : 'flex-1'
                }`}
                disabled={action.disabled}
              >
                {action.icon && <action.icon className="w-4 h-4 mr-1" />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Default Learn More Button if no actions */}
      {actions.length === 0 && (
        <div className="p-6 pt-4 border-t border-gray-200">
          <Button 
            variant="primary" 
            size="sm" 
            className="w-full"
            onClick={onClick}
          >
            Learn More
          </Button>
        </div>
      )}
    </div>
  );
};

ProgramCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  ages: PropTypes.string,
  capacity: PropTypes.string,
  ratio: PropTypes.string,
  schedule: PropTypes.string,
  tuition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  features: PropTypes.arrayOf(PropTypes.string),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      variant: PropTypes.string,
      size: PropTypes.string,
      className: PropTypes.string,
      icon: PropTypes.elementType,
      disabled: PropTypes.bool
    })
  ),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "success", "warning", "premium"]),
  showBadge: PropTypes.bool,
  badgeText: PropTypes.string,
  badgeVariant: PropTypes.string
};

export default ProgramCard;
