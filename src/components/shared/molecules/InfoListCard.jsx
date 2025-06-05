import React from "react";
import PropTypes from "prop-types";

const InfoListCard = ({ 
  title, 
  items = [], 
  icon: Icon, 
  className = "",
  variant = "default",
  showCheckmarks = true,
  orientation = "vertical"
}) => {
  const variantClasses = {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-50 border border-blue-200",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-200",
    info: "bg-gray-50 border border-gray-200"
  };

  const iconColors = {
    default: "text-gray-600",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    info: "text-gray-600"
  };

  const checkmarkColors = {
    default: "text-green-500",
    primary: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    info: "text-gray-500"
  };

  const getListClasses = () => {
    if (orientation === "horizontal") {
      return "flex flex-wrap gap-4";
    }
    return "space-y-3";
  };

  const getItemClasses = () => {
    if (orientation === "horizontal") {
      return "flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm";
    }
    return "flex items-start gap-3";
  };

  const renderIcon = (item) => {
    // If item has its own icon, use it
    if (item.icon) {
      const ItemIcon = item.icon;
      return <ItemIcon className={`w-4 h-4 ${item.iconColor || iconColors[variant]} flex-shrink-0 mt-0.5`} />;
    }
    
    // If showing checkmarks, show checkmark
    if (showCheckmarks) {
      return (
        <svg 
          className={`w-5 h-5 ${checkmarkColors[variant]} flex-shrink-0 mt-0.5`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    // If has emoji, show emoji
    if (item.emoji) {
      return <span className="text-lg mr-1">{item.emoji}</span>;
    }
    
    return null;
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg ${variantClasses[variant]} ${className}`}>
      {/* Header */}
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${iconColors[variant]}`} />
            </div>
          )}
          {title && (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          )}
        </div>
      )}

      {/* Items List */}      <ul className={getListClasses()}>
        {items.map((item, index) => {
          const isString = typeof item === 'string';
          const text = isString ? item : item.text || item.label;
          const description = !isString ? item.description : null;
          const isHighlighted = !isString ? item.highlighted : false;
          const itemKey = !isString && item.id ? item.id : `item-${index}-${text?.slice(0, 10)}`;
          
          return (
            <li key={itemKey} className={getItemClasses()}>
              {renderIcon(item)}
              
              <div className="flex-1">
                <span className={`text-gray-700 text-sm ${isHighlighted ? 'font-semibold text-gray-900' : ''}`}>
                  {text}
                </span>
                
                {description && (
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                )}
              </div>
              
              {!isString && item.badge && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer message */}
      {items.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">No items to display</p>
      )}
    </div>
  );
};

InfoListCard.propTypes = {
  title: PropTypes.string,  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string,
        label: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.elementType,
        iconColor: PropTypes.string,
        emoji: PropTypes.string,
        highlighted: PropTypes.bool,
        badge: PropTypes.string
      })
    ])
  ),
  icon: PropTypes.elementType,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "success", "warning", "info"]),
  showCheckmarks: PropTypes.bool,
  orientation: PropTypes.oneOf(["vertical", "horizontal"])
};

export default InfoListCard;
