import React from "react";
import PropTypes from "prop-types";
import { Badge } from "@atoms";

const ProcessStepCard = ({ 
  step, 
  title, 
  description, 
  icon: Icon, 
  isActive = false,
  isCompleted = false,
  onClick,
  className = "",
  variant = "default",
  size = "md"
}) => {  const variantClasses = {
    default: "theme-aware-bg theme-aware-border border",
    primary: "bg-theme-primary-10 border-theme-primary border",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-200"
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  const iconColors = {
    default: "theme-aware-text-secondary",
    primary: "text-theme-primary",
    success: "text-green-600",
    warning: "text-yellow-600"
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const bgSizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const getIconBgClass = () => {
    if (isCompleted) return "bg-green-100";
    if (isActive) return "bg-blue-100";
    return "bg-gray-100";
  };

  const getIconColorClass = () => {
    if (isCompleted) return "text-green-600";
    if (isActive) return "text-blue-600";
    return iconColors[variant];
  };

  const getBadgeVariant = () => {
    if (isCompleted) return "success";
    if (isActive) return "primary";
    return "secondary";
  };

  return (
    <div 
      className={`text-center rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      onClick={onClick}
    >
      {/* Icon with Step Number */}
      <div className="relative mx-auto mb-4">
        <div className={`${getIconBgClass()} rounded-full flex items-center justify-center mx-auto ${bgSizes[size]}`}>
          {Icon && <Icon className={`${getIconColorClass()} ${iconSizes[size]}`} />}
        </div>
        
        {step && (
          <Badge 
            variant={getBadgeVariant()} 
            className="absolute -top-2 -right-2"
          >
            {step}
          </Badge>
        )}
        
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}      <div className="space-y-2">
        {(() => {
          let titleSize = 'text-lg';
          if (size === 'sm') titleSize = 'text-base';
          else if (size === 'lg') titleSize = 'text-xl';
          
          return (
            <h3 className={`font-semibold text-gray-800 ${titleSize}`}>
              {title}
            </h3>
          );
        })()}
        
        {description && (
          <p className={`text-gray-600 ${
            size === 'sm' ? 'text-sm' : 'text-base'
          }`}>
            {description}
          </p>
        )}
      </div>

      {/* Progress Line for Active Step */}
      {isActive && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  );
};

ProcessStepCard.propTypes = {
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  isActive: PropTypes.bool,
  isCompleted: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "success", "warning"]),
  size: PropTypes.oneOf(["sm", "md", "lg"])
};

export default ProcessStepCard;
