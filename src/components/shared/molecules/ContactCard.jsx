import React from "react";
import PropTypes from "prop-types";
import { Button } from "@atoms";

const ContactCard = ({ 
  title, 
  description, 
  contactInfo = [], 
  icon: Icon, 
  actions = [], 
  className = "",
  variant = "default" 
}) => {
  const variantClasses = {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-50 border border-blue-200",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-200"
  };

  const iconColors = {
    default: "text-gray-600",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600"
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg text-center ${variantClasses[variant]} ${className}`}>
      {Icon && (
        <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${iconColors[variant]}`} />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      
      {contactInfo.length > 0 && (
        <div className="space-y-1 mb-4">
          {contactInfo.map((info, index) => (
            <p key={index} className="text-gray-600">
              {info}
            </p>
          ))}
        </div>
      )}
      
      {actions.length > 0 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "primary"}
              size={action.size || "sm"}
              onClick={action.onClick}
              className={action.className}
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

ContactCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  contactInfo: PropTypes.arrayOf(PropTypes.string),
  icon: PropTypes.elementType,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      variant: PropTypes.string,
      size: PropTypes.string,
      className: PropTypes.string,
      icon: PropTypes.elementType
    })
  ),
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "success", "warning"])
};

export default ContactCard;
