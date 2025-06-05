import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "@atoms";

const NewsletterSignup = ({ 
  title = "Stay Connected",
  description = "Get updates about events, programs, and educational tips.",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  onSubmit,
  className = "",
  variant = "default",
  layout = "horizontal",
  showIcon = true,
  successMessage = "Thank you for subscribing!",
  errorMessage = "Please enter a valid email address.",
  disabled = false
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const variantClasses = {
    default: "bg-white border border-gray-200",
    primary: "bg-blue-50 border border-blue-200",
    dark: "bg-gray-800 text-white",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
    transparent: "bg-transparent"
  };

  const textColors = {
    default: "text-gray-800",
    primary: "text-gray-800",
    dark: "text-white",
    gradient: "text-white",
    transparent: "text-gray-800"
  };

  const descriptionColors = {
    default: "text-gray-600",
    primary: "text-gray-600",
    dark: "text-gray-300",
    gradient: "text-blue-100",
    transparent: "text-gray-600"
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus("error");
      setMessage("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage(errorMessage);
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      
      setStatus("success");
      setMessage(successMessage);
      setEmail("");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
      
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  const layoutClasses = {
    horizontal: "flex flex-col md:flex-row gap-4 items-end",
    vertical: "space-y-4",
    inline: "flex gap-2"
  };

  const inputContainerClasses = {
    horizontal: "flex-1",
    vertical: "w-full",
    inline: "flex-1"
  };

  return (
    <div className={`rounded-lg p-6 ${variantClasses[variant]} ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          {showIcon && (
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          )}
          <h4 className={`text-lg font-semibold ${textColors[variant]}`}>
            {title}
          </h4>
        </div>
        
        {description && (
          <p className={`${descriptionColors[variant]} text-sm`}>
            {description}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={layoutClasses[layout]}>
        <div className={inputContainerClasses[layout]}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || status === "loading"}
            error={status === "error"}
            className={layout === 'inline' ? 'rounded-r-none' : ''}
          />
        </div>
        
        <Button
          type="submit"
          variant={variant === "dark" || variant === "gradient" ? "secondary" : "primary"}
          disabled={disabled || status === "loading"}
          loading={status === "loading"}
          className={layout === 'inline' ? 'rounded-l-none border-l-0' : ''}
        >
          {status === "loading" ? "Subscribing..." : buttonText}
        </Button>
      </form>

      {/* Status Messages */}
      {message && (
        <div className={`mt-3 p-3 rounded-md text-sm ${
          status === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          <div className="flex items-center gap-2">
            {status === "success" ? (
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <p className={`mt-3 text-xs ${descriptionColors[variant]} opacity-75`}>
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

NewsletterSignup.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "primary", "dark", "gradient", "transparent"]),
  layout: PropTypes.oneOf(["horizontal", "vertical", "inline"]),
  showIcon: PropTypes.bool,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool
};

export default NewsletterSignup;
