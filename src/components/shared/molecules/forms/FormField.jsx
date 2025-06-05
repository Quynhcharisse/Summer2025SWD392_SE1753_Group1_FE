import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputSelect } from '@atoms';
import { useTranslation } from "react-i18next";

const FormField = (props) => {
  const { t } = useTranslation("form");
  const {
    type = 'text',
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    errorMessage,
    options = [],
    size = 'md',
    disabled = false,
    ...rest
  } = props;
  const fieldId = `field-${name}`;

  // Render input/select
  if (type === 'select') {
    return (
      <InputSelect
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        disabled={disabled}
        error={error}
        errorMessage={errorMessage ? t(errorMessage, { field: t(label) }) : undefined}
        size={size}
        required={required}
        {...rest}
      />
    );
  }
  // Default: input
  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="block font-medium text-gray-700 mb-1">
          {t(label)}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input
        id={fieldId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || (required ? t('required', { field: t(label) }) : undefined)}
        disabled={disabled}
        error={error}
        errorMessage={errorMessage ? t(errorMessage, { field: t(label) }) : undefined}
        size={size}
        required={required}
        {...rest}
      />
      {error && errorMessage && (
        <div className="text-red-600 text-sm">{t(errorMessage, { field: t(label) })}</div>
      )}
    </div>
  );
};

FormField.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'tel', 'url', 'select']),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  options: PropTypes.array,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool
};

export default FormField;
