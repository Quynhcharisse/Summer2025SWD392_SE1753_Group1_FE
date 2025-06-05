import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, Mic, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({
  placeholder,
  value = '',
  onChange,
  onSearch,
  onMicClick,
  onSpeechToText,
  loading = false,
  size = 'medium',
  theme = 'light',
  variant = 'default',
  showMicIcon = true,
  showSearchIcon = true,
  className = '',
  disabled = false,
  autoFocus = false,
  active = false,
  ...props
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Sync internal state with external value prop
  useEffect(() => {
    setSearchValue(value);
  }, [value]);
  // Size variants
  const sizeClasses = {
    small: 'h-8 px-3 text-sm',
    sm: 'h-8 px-3 text-sm',
    medium: 'h-10 px-4 text-base',
    md: 'h-10 px-4 text-base',
    large: 'h-12 px-5 text-lg',
    lg: 'h-12 px-5 text-lg',
    xlarge: 'h-14 px-6 text-xl',
    xl: 'h-14 px-6 text-xl'
  };
  // Theme variants với active state - theme aware
  const themeClasses = {
    light: {
      container: active || isFocused 
        ? 'theme-aware-bg border-theme-primary shadow-md' 
        : 'theme-aware-bg theme-aware-border hover:border-theme-primary focus-within:border-theme-primary',
      input: 'theme-aware-text placeholder-gray-500',
      icons: active || isFocused 
        ? 'text-theme-primary' 
        : 'theme-aware-text-secondary hover:text-theme-primary'
    },
    dark: {
      container: active || isFocused 
        ? 'theme-aware-bg border-theme-primary shadow-md' 
        : 'theme-aware-bg theme-aware-border hover:border-theme-primary focus-within:border-theme-primary',
      input: 'theme-aware-text placeholder-gray-400',
      icons: active || isFocused 
        ? 'text-theme-primary' 
        : 'theme-aware-text-secondary hover:text-theme-primary'
    },    minimal: {
      container: active || isFocused 
        ? 'theme-aware-bg border-theme-primary shadow-sm' 
        : 'bg-theme-surface theme-aware-border hover:bg-theme-background focus-within:bg-theme-background focus-within:border-theme-primary',
      input: 'theme-aware-text placeholder-gray-400',
      icons: active || isFocused 
        ? 'text-theme-primary' 
        : 'theme-aware-text-secondary hover:text-theme-primary'
    }
  };
  // Variant styles
  const variantClasses = {
    default: 'rounded-2xl border',
    rounded: 'rounded-full border',
    square: 'rounded-lg border',
    none: 'rounded-none border-0 border-b-2'
  };

  // Icon sizes based on component size
  const iconSizes = {
    small: 16,
    sm: 16,
    medium: 20,
    md: 20,
    large: 24,
    lg: 24,
    xlarge: 28,
    xl: 28
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue, e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onSearch?.(searchValue);
    }
  };

  const handleMicClick = (e) => {
    e.preventDefault();
    if (!loading) {
      // Use onSpeechToText if provided, fallback to onMicClick
      if (onSpeechToText) {
        onSpeechToText();
      } else {
        onMicClick?.(e);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;
  const currentSize = sizeClasses[size] || sizeClasses.medium;
  const currentIconSize = iconSizes[size] || iconSizes.medium;
  const placeholderText = placeholder || t('common.search', 'Nhập nội dung cần tìm...');

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        relative flex items-center transition-all duration-200
        ${currentSize}
        ${variantClasses[variant] || variantClasses.default}
        ${currentTheme.container}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${active ? 'ring-2 ring-green-200' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Search Icon */}
      {showSearchIcon && (
        <button
          type="submit"
          disabled={disabled || loading}
          className={`
            flex items-center justify-center mr-2 transition-all duration-200
            ${currentTheme.icons}
            ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${active || isFocused ? 'scale-110' : ''}
          `}
          aria-label="Search"
        >
          {loading ? (
            <Loader2 size={currentIconSize} className="animate-spin" />
          ) : (
            <Search size={currentIconSize} />          )}
        </button>
      )}

      {/* Input Field */}
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholderText}
        disabled={disabled || loading}
        autoFocus={autoFocus}
        className={`
          flex-1 bg-transparent outline-none border-none
          ${currentTheme.input}
          ${disabled || loading ? 'cursor-not-allowed' : ''}
        `}
      />

      {/* Microphone Icon */}
      {showMicIcon && (
        <button
          type="button"
          onClick={handleMicClick}
          disabled={disabled || loading}
          className={`
            flex items-center justify-center ml-2 transition-all duration-200
            ${currentTheme.icons}
            ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
            ${active || isFocused ? 'scale-110' : ''}
          `}
          aria-label="Voice search"
          title="Click to use voice search"
        >
          <Mic size={currentIconSize} />
        </button>
      )}

      {/* Active indicator (optional) */}
      {active && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-500 rounded-full"></div>
      )}    </form>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onMicClick: PropTypes.func,
  onSpeechToText: PropTypes.func,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'sm', 'medium', 'md', 'large', 'lg', 'xlarge', 'xl']),
  theme: PropTypes.oneOf(['light', 'dark', 'minimal']),
  variant: PropTypes.oneOf(['default', 'rounded', 'square', 'none']),
  showMicIcon: PropTypes.bool,
  showSearchIcon: PropTypes.bool,
  className: PropTypes.string,  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  active: PropTypes.bool
};

export default SearchBar;
