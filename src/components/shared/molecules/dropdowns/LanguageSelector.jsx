import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

// Component tạo cờ Việt Nam bằng CSS
const VietnamFlag = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-3",
    md: "w-6 h-4", 
    lg: "w-8 h-5",
    xl: "w-10 h-6"
  };

  const starSizes = {
    sm: "text-[8px]",
    md: "text-xs",
    lg: "text-sm", 
    xl: "text-base"
  };

  return (
    <div className={`relative ${sizeClasses[size] || sizeClasses.md} border border-gray-300 rounded-sm overflow-hidden`}>
      {/* Nền đỏ */}
      <div className="absolute inset-0 bg-red-600"></div>
      
      {/* Ngôi sao vàng ở giữa */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-yellow-400 ${starSizes[size] || starSizes.md} leading-none`}>
          ★
        </div>
      </div>
    </div>
  );
};

VietnamFlag.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};

export default function LanguageSelector({ 
  size = "md",
  theme = "light",
  className = "",
  position = "bottom-left",
  showFlag = true,
  showText = false,
  variant = "default",
  disabled = false,
  fullWidth = false,
  compact = false
}) {  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "px-2 py-1 gap-1.5",
      icon: "w-3 h-3",
      text: "text-xs",
      dropdown: "min-w-[120px]",
      dropdownItem: "px-3 py-1.5 text-xs"
    },
    md: {
      button: "px-3 py-2 gap-2", 
      icon: "w-4 h-4",
      text: "text-sm",
      dropdown: "min-w-[160px]",
      dropdownItem: "px-4 py-2 text-sm"
    },
    lg: {
      button: "px-4 py-2.5 gap-2.5",
      icon: "w-5 h-5", 
      text: "text-base",
      dropdown: "min-w-[180px]",
      dropdownItem: "px-5 py-2.5 text-base"
    },
    xl: {
      button: "px-5 py-3 gap-3",
      icon: "w-6 h-6",
      text: "text-lg", 
      dropdown: "min-w-[200px]",
      dropdownItem: "px-6 py-3 text-lg"
    }
  };
  // Theme configurations - theme aware
  const themeConfig = {
    light: {
      button: "theme-aware-bg hover:bg-theme-surface theme-aware-border theme-aware-text",
      dropdown: "theme-aware-bg theme-aware-border shadow-lg",
      dropdownItem: "theme-aware-text hover:bg-theme-surface",
      active: "bg-theme-primary-10 text-theme-primary",
      divider: "bg-gray-400"
    },
    dark: {
      button: "theme-aware-bg hover:bg-theme-surface theme-aware-border theme-aware-text",
      dropdown: "theme-aware-bg theme-aware-border shadow-xl",
      dropdownItem: "theme-aware-text hover:bg-theme-surface", 
      active: "bg-theme-primary-10 text-theme-primary",
      divider: "bg-gray-500"
    },
    primary: {
      button: "bg-theme-primary hover:opacity-90 border-theme-primary text-white",
      dropdown: "theme-aware-bg theme-aware-border shadow-lg",
      dropdownItem: "theme-aware-text hover:bg-theme-primary-10",
      active: "bg-theme-primary-10 text-theme-primary",
      divider: "bg-theme-primary"
    }
  };

  // Variant configurations
  const variantConfig = {
    default: "border rounded-md",
    outline: "border-2 rounded-md",
    ghost: "border-0",
    minimal: "border-0 bg-transparent hover:bg-gray-100"
  };

  // Position configurations
  const positionConfig = {
    "bottom-left": "top-full left-0",
    "bottom-right": "top-full right-0", 
    "top-left": "bottom-full left-0 mb-1",
    "top-right": "bottom-full right-0 mb-1"
  };
  const currentSizeConfig = sizeConfig[size] || sizeConfig.md;
  const currentThemeConfig = themeConfig[theme] || themeConfig.light;
  const currentVariantConfig = variantConfig[variant] || variantConfig.default;
  const currentPositionConfig = positionConfig[position] || positionConfig["bottom-left"];
  const languages = [
    { 
      code: 'vi', 
      name: 'Tiếng Việt',
      shortName: 'VI',
      flag: <VietnamFlag size={size} />
    },
    { 
      code: 'en', 
      name: 'English',
      shortName: 'EN',
      flag: (
        <div className={`${currentSizeConfig.icon || "w-4 h-4"} bg-blue-500 border border-gray-300 flex items-center justify-center text-white text-xs rounded-sm`}>
          EN
        </div>
      )
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  // Safety check - nếu vẫn không có currentLanguage thì tạo default
  const safeCurrentLanguage = currentLanguage || {
    code: 'vi',
    name: 'Tiếng Việt',
    shortName: 'VI',
    flag: <VietnamFlag />
  };  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };
  // Xác định gap class
  let gapClass;
  if (compact) {
    gapClass = 'gap-1';
  } else if (currentSizeConfig.button.includes('gap')) {
    gapClass = '';
  } else {
    gapClass = 'gap-2';
  }

  const buttonClasses = `
    flex items-center transition-colors duration-200
    ${currentSizeConfig.button}
    ${currentThemeConfig.button}
    ${currentVariantConfig}
    ${fullWidth ? 'w-full justify-between' : 'justify-center'}
    ${gapClass}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
      {/* Button chính */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={buttonClasses}
        disabled={disabled}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >        {/* Cờ hiện tại */}
        {showFlag && safeCurrentLanguage.flag}
        
        {/* Text hiện tại (nếu showText = true) */}
        {showText && (
          <span className={`${currentSizeConfig.text} font-medium`}>
            {compact ? safeCurrentLanguage.shortName : safeCurrentLanguage.name}
          </span>
        )}
        
        {/* Đường phân cách (chỉ hiện khi có cả flag và text) */}
        {showFlag && !compact && (
          <div className={`w-px h-4 ${currentThemeConfig.divider}`}></div>
        )}
        
        {/* Icon globe */}
        {!compact && (
          <Globe className={`${currentSizeConfig.icon} ${currentThemeConfig.button.includes('text-white') ? 'text-white' : 'text-gray-600'}`} />
        )}
        
        {/* Dropdown arrow */}
        <ChevronDown 
          className={`${currentSizeConfig.icon} transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${currentThemeConfig.button.includes('text-white') ? 'text-white' : 'text-gray-600'}`} 
        />
      </button>      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className={`absolute ${currentPositionConfig} mt-1 ${currentThemeConfig.dropdown} border rounded-md ${currentSizeConfig.dropdown} z-50`}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}              className={`w-full flex items-center gap-3 ${currentSizeConfig.dropdownItem} text-left transition-colors duration-200 ${
                safeCurrentLanguage.code === language.code 
                  ? currentThemeConfig.active
                  : currentThemeConfig.dropdownItem
              } first:rounded-t-md last:rounded-b-md`}
              role="option"
              aria-selected={safeCurrentLanguage.code === language.code}
            >
              {language.flag}
              <span className={currentSizeConfig.text}>{language.name}</span>
              {safeCurrentLanguage.code === language.code && (
                <div className="ml-auto w-2 h-2 bg-current rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay để đóng dropdown khi click bên ngoài */}
      {isOpen && !disabled && (
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
        /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
      )}
    </div>
  );
}

LanguageSelector.propTypes = {
  /** Kích thước của component */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  /** Theme màu sắc */
  theme: PropTypes.oneOf(['light', 'dark', 'primary']),
  /** CSS class tùy chỉnh */
  className: PropTypes.string,
  /** Vị trí dropdown */
  position: PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
  /** Hiển thị cờ */
  showFlag: PropTypes.bool,
  /** Hiển thị text ngôn ngữ */
  showText: PropTypes.bool,
  /** Variant style */
  variant: PropTypes.oneOf(['default', 'outline', 'ghost', 'minimal']),
  /** Vô hiệu hóa component */
  disabled: PropTypes.bool,
  /** Chiếm toàn bộ chiều rộng */
  fullWidth: PropTypes.bool,
  /** Chế độ compact (ít khoảng trắng) */
  compact: PropTypes.bool
};
