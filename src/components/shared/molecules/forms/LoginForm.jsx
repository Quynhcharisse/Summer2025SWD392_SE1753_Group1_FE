import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@atoms';

const LoginForm = ({
  onSubmit,
  loading = false,
  error,
  emailValue = '',
  passwordValue = '',
  onEmailChange,
  onPasswordChange,
  showRememberMe = true,
  rememberMe = false,
  onRememberMeChange,
  size = 'md',
  className = ''
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && !loading) {
      onSubmit({
        email: emailValue,
        password: passwordValue,
        rememberMe
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={emailValue}
          onChange={(e) => onEmailChange?.(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={passwordValue}
          onChange={(e) => onPasswordChange?.(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
      </div>

      {showRememberMe && (
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange?.(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size={size}
        disabled={loading}
        loading={loading}
        className="w-full"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  emailValue: PropTypes.string,
  passwordValue: PropTypes.string,
  onEmailChange: PropTypes.func,
  onPasswordChange: PropTypes.func,
  showRememberMe: PropTypes.bool,
  rememberMe: PropTypes.bool,
  onRememberMeChange: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default LoginForm;
