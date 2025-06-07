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
    <p className="text-red-500 text-xs flex items-center mt-1 bg-red-50/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-red-200/50">
      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
      <span className="font-medium">{error.message}</span>
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
}) => {  let sizeClasses = size === "md" ? "py-4 text-base" : "py-3 text-sm";
  let inputType = type;
  if (showToggle) {
    inputType = show ? "text" : "password";
  }
  
  let autoComplete;
  if (name === "password" || name === "confirmPassword") {
    autoComplete = "new-password";
  } else if (name === "identityNumber") {
    autoComplete = "off";
  } else {
    autoComplete = undefined;
  }
  return (
    <div className="space-y-2">
      <div className="relative group">
        <Input
          type={inputType}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          error={!!error}
          {...register(name, rules)}          className={`w-full pl-11 ${
            showToggle ? "pr-11" : "pr-4"
          } border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 text-sm ${
            error
              ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 hover:border-gray-300 focus:border-blue-500 group-hover:shadow-md"
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${sizeClasses} ${className}`}
        />        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className={`w-5 h-5 transition-colors duration-200 ${
            error ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
          }`} />
        </div>
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-lg hover:bg-gray-100"
            tabIndex={-1}
          >            {show ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
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
  };  return (
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
      className={`w-full max-w-5xl mx-auto px-6 py-6 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl space-y-4 animate-fade-in relative overflow-hidden ${className}`}
      noValidate
    >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl"></div>        {/* Compact Header with Language Select */}
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-white" />
            </div>            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                {t("signup_header")}
              </h2>
              <p className="text-gray-600 text-sm">
                {t("signup_subtitle")}
              </p>
            </div>
          </div>
          
          <InputSelect
            name="language"
            value={selectedLang}
            onChange={handleLanguageChange}
            options={[
              { value: "vi", label: "🇻🇳 VN" },
              { value: "en", label: "🇺🇸 EN" },
            ]}
            size="sm"
            variant="default"
            className="w-20 bg-white/90 backdrop-blur-sm text-gray-700 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 h-8 text-xs rounded-lg shadow-sm"
          />
        </div>        {/* Form Fields in 2 Columns - Compact Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative z-10">
          {/* Left Column */}
          <div className="space-y-3">
            <InputWithIcon
              icon={User}
              type="text"
              name="name"
              placeholder={t("full_name", "Họ và tên")}
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
              size="sm"
            />

            <InputWithIcon
              icon={Mail}
              type="email"
              name="email"
              placeholder={t("email", "Email")}
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
              size="sm"
            />

            <InputWithIcon
              icon={Phone}
              type="tel"
              name="phone"
              placeholder={t("phone", "Số điện thoại")}
              register={register}
              rules={{
                required: {
                  value: true,
                  message: t("required_phone", "Số điện thoại không được để trống"),
                },
                pattern: {
                  value: /^\d{10}$/,
                  message: t("invalid_phone", "Số điện thoại chỉ gồm 9–11 chữ số"),
                },
              }}
              error={errors.phone}
              disabled={loading || isSubmitting}
              size="sm"
            />
          </div>          {/* Right Column */}
          <div className="space-y-3">
            {/* Gender */}
            <div className="space-y-1">
              <div className="relative group">                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <User className={`w-5 h-5 transition-colors duration-200 ${
                    errors.gender ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
                  }`} />
                </div>
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
                    { value: "male", label: t("male", "👨 Nam") },
                    { value: "female", label: t("female", "👩 Nữ") },
                    { value: "other", label: t("other", "🧑 Khác") },
                  ]}
                  error={!!errors.gender}
                  disabled={loading || isSubmitting}
                  size="sm"
                  variant="default"
                  className={`pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm text-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm ${
                    errors.gender
                      ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-500 group-hover:shadow-md"
                  }`}
                />
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs flex items-center mt-1 bg-red-50/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-red-200/50">
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="font-medium">{errors.gender.message}</span>
                </p>
              )}
            </div>

            <InputWithIcon
              icon={CreditCard}
              type="text"
              name="identityNumber"
              placeholder={t("identity_number", "Số CMT/CCCD")}
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
              size="sm"
            />

            <InputWithIcon
              icon={Lock}
              type="password"
              name="password"
              placeholder={t("password", "Mật khẩu")}
              register={register}              rules={{
                required: {
                  value: true,
                  message: t("required_password", "Mật khẩu không được để trống"),
                },
                minLength: {
                  value: 8,
                  message: t("min_password", "Mật khẩu tối thiểu 8 ký tự"),
                },
                pattern: {
                  value: /^(?=.*[A-Z]).{8,}$/,
                  message: t("password_uppercase", "Mật khẩu phải chứa ít nhất một chữ cái viết hoa"),
                },
              }}
              error={errors.password}
              showToggle={true}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              disabled={loading || isSubmitting}
              size="sm"
            />

            <InputWithIcon
              icon={Lock}
              type="password"
              name="confirmPassword"
              placeholder={t("confirm_password", "Xác nhận mật khẩu")}
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
              size="sm"
            />
          </div>
        </div>        {/* Submit Button - More Compact */}
        <div className="pt-4 relative z-10 lg:col-span-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full py-3 text-base font-bold rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none transform hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:transform-none disabled:hover:scale-100"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" className="mr-2" />
                <span>{t("signup_loading", "Đang đăng ký...")}</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <User className="w-4 h-4 mr-2" />
                {t("signup", "Đăng ký ngay")}
              </span>
            )}
          </Button>        </div>
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
