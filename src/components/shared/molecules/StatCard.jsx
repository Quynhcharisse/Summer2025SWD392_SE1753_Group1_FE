import React from "react";
import PropTypes from "prop-types";

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className = "",
  variant = "default" 
}) => {
  const variantClasses = {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-50 border border-blue-200",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-200",
    dark: "bg-gray-800 border border-gray-700 text-white"
  };

  const valueColors = {
    default: "text-gray-800",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    dark: "text-white"
  };

  const iconColors = {
    default: "text-gray-500",
    primary: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    dark: "text-gray-300"
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg ${variantClasses[variant]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${variant === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${valueColors[variant]} mb-1`}>
            {value}
          </p>
          {description && (
            <p className={`text-sm ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.type === 'positive' ? 'text-green-600' : 
              trend.type === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <span className="mr-1">
                {trend.type === 'positive' ? '↗' : trend.type === 'negative' ? '↘' : '→'}
              </span>
              {trend.value} {trend.label}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 ${iconColors[variant]}`}>
            <Icon size={48} />
          </div>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  trend: PropTypes.shape({
    type: PropTypes.oneOf(['positive', 'negative', 'neutral']),
    value: PropTypes.string,
    label: PropTypes.string
  }),
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "success", "warning", "dark"])
};

export default StatCard;
