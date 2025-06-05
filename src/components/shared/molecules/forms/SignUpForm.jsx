import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Button, Input, InputSelect, Spinner } from "@atoms";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// ==== Atomic Error Message (Atom) ====
const ErrorMessage = ({ error }) =>
  error ? (
    <p className="text-red-500 dark:text-red-400 playfull:text-pink-500 text-xs flex items-center mt-1 bg-white dark:bg-gray-900 playfull:bg-pink-50 rounded-md px-2 py-1">
      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
      {error.message}
    </p>
  ) : null;

ErrorMessage.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
};

// ==== Atomic Input with Icon (Molecule) ====
const InputWithIcon = ({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  register,
  rules,
  error,
  showToggle = false,
  show = false,
  onToggle = null,
  disabled,
  size = "sm",
  className = "",
}) => {
  let sizeClasses = size === "md" ? "py-2.5 text-base" : "py-2 text-sm";
  let inputType = showToggle ? (show ? "text" : "password") : type;
  let autoComplete =
    name === "password" || name === "confirmPassword"
      ? "new-password"
      : name === "identityNumber"
      ? "off"
      : undefined;
  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          type={inputType}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          error={!!error}
          {...register(name, rules)}
          className={`w-full pl-10 ${
            showToggle ? "pr-10" : "pr-3"
          } border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 playfull:bg-pink-50 text-gray-900 dark:text-gray-100 playfull:text-pink-900 ${
            error
              ? "border-red-400 bg-red-50 dark:bg-red-900 playfull:bg-pink-100 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 playfull:border-pink-300 hover:border-gray-400 dark:hover:border-gray-400 playfull:hover:border-pink-400 focus:border-blue-500 dark:focus:border-blue-400 playfull:focus:border-pink-500"
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${sizeClasses} ${className}`}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-4 h-4 text-gray-400 dark:text-gray-300 playfull:text-pink-400" />
        </div>
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-200 playfull:text-pink-400 hover:text-gray-600 dark:hover:text-gray-100 playfull:hover:text-pink-600 transition-colors z-10"
            tabIndex={-1}
          >
            {show ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

InputWithIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object,
  error: PropTypes.object,
  showToggle: PropTypes.bool,
  show: PropTypes.bool,
  onToggle: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md"]),
  className: PropTypes.string,
};

// ==== SignUpForm (Organism) ====
const SignUpForm = ({ onSubmit, loading, className = "" }) => {
  const { t, i18n } = useTranslation("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language || "vi");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });
  const passwordValue = watch("password", "");
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log("🔥 SignUpForm handleSubmit called with data:", data);
        console.log("🔥 onSubmit prop exists:", !!onSubmit);
        if (onSubmit) {
          console.log("🔥 Calling onSubmit with data...");
          onSubmit(data);
        } else {
          console.error("❌ onSubmit prop is missing!");
        }
      })}
      className={`max-w-xs w-full mx-auto px-2 py-3 theme-aware-bg playfull:bg-pink-50 rounded-lg shadow space-y-2 theme-aware-text ${className}`}
      style={{ maxHeight: "50vh", overflowY: "auto" }}
      noValidate
    >
      {/* Language Select (Molecule) */}
      <div className="mb-1 flex justify-end">
        <InputSelect
          name="language"
          value={selectedLang}
          onChange={handleLanguageChange}
          options={[
            { value: "vi", label: "Tiếng Việt" },
            { value: "en", label: "English" },
          ]}
          size="sm"
          variant="default"
          className="w-28 bg-white dark:bg-gray-800 playfull:bg-pink-50 text-gray-900 dark:text-gray-100 playfull:text-pink-900 border-gray-300 dark:border-gray-600 playfull:border-pink-300 focus:border-blue-500 dark:focus:border-blue-400 playfull:focus:border-pink-500 h-8 text-xs"
        />
      </div>
      
      <InputWithIcon
        icon={User}
        type="text"
        name="name"
        placeholder={t("full_name")}
        register={register}
        rules={{
          required: {
            value: true,
            message: t("required_name", "Họ và tên không được để trống"),
          },
          pattern: {
            value: /^[a-zA-ZÀ-ỹ\s\-']+$/,
            message: t(
              "invalid_name",
              "Tên chỉ được chứa chữ cái, dấu cách, dấu gạch ngang và dấu nháy đơn"
            ),
          },
        }}
        error={errors.name}
        disabled={loading || isSubmitting}
      />
      {/* Email */}
      <InputWithIcon
        icon={Mail}
        type="email"
        name="email"
        placeholder={t("email")}
        register={register}
        rules={{
          required: {
            value: true,
            message: t("required_email", "Email không được để trống"),
          },
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t("invalid_email", "Email không hợp lệ"),
          },
        }}
        error={errors.email}
        disabled={loading || isSubmitting}
      />
      {/* Phone */}
      <InputWithIcon
        icon={Phone}
        type="tel"
        name="phone"
        placeholder={t("phone")}
        register={register}
        rules={{
          required: {
            value: true,
            message: t("required_phone", "Số điện thoại không được để trống"),
          },
          pattern: {
            value: /^\d{9,11}$/,
            message: t("invalid_phone", "Số điện thoại chỉ gồm 9–11 chữ số"),
          },
        }}
        error={errors.phone}
        disabled={loading || isSubmitting}
      />
      {/* Gender */}
      <div className="space-y-0.5">
        <InputSelect
          name="gender"
          {...register("gender", {
            required: {
              value: true,
              message: t("required_gender", "Vui lòng chọn giới tính"),
            },
          })}
          value={watch("gender") || ""}
          onChange={(e) => register("gender").onChange(e)}
          onBlur={(e) => register("gender").onBlur(e)}
          options={[
            { value: "", label: t("select_gender", "Chọn giới tính") },
            { value: "male", label: t("male", "Nam") },
            { value: "female", label: t("female", "Nữ") },
            { value: "other", label: t("other", "Khác") },
          ]}
          error={!!errors.gender}
          disabled={loading || isSubmitting}
          size="md"
          variant="default"
          className="pl-10 pr-10 bg-white dark:bg-gray-800 playfull:bg-pink-50 text-gray-900 dark:text-gray-100 playfull:text-pink-900 border-gray-300 dark:border-gray-600 playfull:border-pink-300 focus:border-blue-500 dark:focus:border-blue-400 playfull:focus:border-pink-500 h-9 text-sm"
        />
        <ErrorMessage error={errors.gender} />
      </div>
      {/* Identity Number */}
      <InputWithIcon
        icon={CreditCard}
        type="text"
        name="identityNumber"
        placeholder={t("identity_number")}
        register={register}
        rules={{
          required: {
            value: true,
            message: t("required_identity", "Số CMT/CCCD không được để trống"),
          },
          pattern: {
            value: /^\d{12}$/,
            message: t(
              "invalid_identity",
              "Số CMT/CCCD chỉ được gồm 12 chữ số"
            ),
          },
        }}
        error={errors.identityNumber}
        disabled={loading || isSubmitting}
      />
      {/* Password */}
      <InputWithIcon
        icon={Lock}
        type="password"
        name="password"
        placeholder={t("password")}
        register={register}
        rules={{
          required: {
            value: true,
            message: t("form.required_password"),
          },
          minLength: {
            value: 6,
            message: t("form.min_password", "Mật khẩu tối thiểu 6 ký tự"),
          },
        }}
        error={errors.password}
        showToggle={true}
        show={showPassword}
        onToggle={() => setShowPassword((v) => !v)}
        disabled={loading || isSubmitting}
      />
      {/* Confirm Password */}
      <InputWithIcon
        icon={Lock}
        type="password"
        name="confirmPassword"
        placeholder={t("confirm_password")}
        register={register}
        rules={{
          required: {
            value: true,
            message: t(
              "required_confirm_password",
              "Vui lòng xác nhận mật khẩu"
            ),
          },
          validate: (value) =>
            value === passwordValue ||
            t("password_mismatch", "Mật khẩu xác nhận không khớp"),
        }}
        error={errors.confirmPassword}
        showToggle={true}
        show={showConfirmPassword}
        onToggle={() => setShowConfirmPassword((v) => !v)}
        disabled={loading || isSubmitting}
      />
      {/* Submit Button (Atom) */}
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="w-full py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg bg-blue-600 dark:bg-blue-500 playfull:bg-pink-500 text-white border-none"
        disabled={loading || isSubmitting}
      >
        {loading || isSubmitting ? (
          <div className="flex items-center justify-center">
            <Spinner size="sm" className="mr-2" />
            {t("signup_loading", "Signing Up...")}
          </div>
        ) : (
          t("signup", "Sign Up")
        )}
      </Button>
    </form>
  );
};

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

SignUpForm.defaultProps = {
  loading: false,
  className: "",
};

export default SignUpForm;
