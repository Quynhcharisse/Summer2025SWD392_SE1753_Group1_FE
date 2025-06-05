import React from "react";
import PropTypes from "prop-types";
import { Button } from "@atoms";

const ActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  actions = [], 
  className = "",
  variant = "default" 
}) => {
  const variantClasses = {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-50 border border-blue-200",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-200",
    danger: "bg-red-50 border border-red-200"
  };

  const iconColors = {
    default: "text-gray-600",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600"
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${variantClasses[variant]} ${className}`}>
      {Icon && (
        <div className={`w-12 h-12 ${iconColors[variant]} mb-4`}>
          <Icon size={48} />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      
      {actions.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "primary"}
              size={action.size || "sm"}
              onClick={action.onClick}
              className={action.className}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      variant: PropTypes.string,
      size: PropTypes.string,
      className: PropTypes.string
    })
  ),
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "success", "warning", "danger"])
};

export default ActionCard;
