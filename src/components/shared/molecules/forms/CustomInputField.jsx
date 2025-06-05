import React from "react";
import { useTranslation } from "react-i18next";
import Input from "@atoms/Input";
import Tooltip from "@atoms/Tooltip";
import PropTypes from "prop-types";

// Đặt component này trong src/components/shared/molecules/forms/ để tuân thủ atomic design.
// Đây là một molecule vì nó kết hợp nhiều atom: Input, Label, Tooltip, ErrorMessage, Icon...
// Có thể sử dụng lại ở mọi form, mọi page.

const CustomInputField = ({
  id,
  name,
  label,
  required = false,
  value,
  onChange,
  placeholder,
  error,
  errorMessage,
  leftIcon,
  rightIcon,
  tooltip,
  type = "text",
  disabled = false,
  readOnly = false,
  className = "",
  inputClassName = "",
  ...props
}) => {
  const { t } = useTranslation("form");
  const fieldId = id || `field-${name}`;
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="block font-medium text-gray-700 mb-1">
          {tooltip ? (
            <Tooltip content={tooltip}>
              <span className="inline-flex items-center">
                {t(label)}{required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </Tooltip>
          ) : (
            <span>
              {t(label)}{required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && <span className="absolute left-3">{leftIcon}</span>}
        <Input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || (required ? t('required', { field: t(label) }) : undefined)}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          error={!!error}
          errorMessage={errorMessage ? t(errorMessage, { field: t(label) }) : undefined}
          className={`w-full pl-${leftIcon ? 10 : 4} pr-${rightIcon ? 10 : 4} ${inputClassName}`}
          {...props}
        />
        {rightIcon && <span className="absolute right-3">{rightIcon}</span>}
      </div>
      {error && errorMessage && (
        <div className="text-red-600 text-sm">{t(errorMessage, { field: t(label) })}</div>
      )}
    </div>
  );
};

CustomInputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  tooltip: PropTypes.node,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default CustomInputField;
