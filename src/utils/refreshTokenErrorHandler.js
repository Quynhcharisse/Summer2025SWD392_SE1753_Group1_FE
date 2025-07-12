/**
 * Refresh Token Error Handler Utility
 * Provides centralized handling for refresh token 403 errors
 */

import { refreshToken } from '@services/JWTService.jsx';

/**
 * Error types for refresh token failures
 */
export const REFRESH_ERROR_TYPES = {
  EXPIRED: 'EXPIRED',           // Refresh token expired (403)
  INVALID: 'INVALID',           // Refresh token invalid/malformed (401)
  NETWORK: 'NETWORK',           // Network error
  SERVER: 'SERVER',             // Server error (5xx)
  UNKNOWN: 'UNKNOWN'            // Unknown error
};

/**
 * Categorize refresh token error
 * @param {Error} error - The error from refresh token request
 * @returns {string} Error type from REFRESH_ERROR_TYPES
 */
export const categorizeRefreshError = (error) => {
  if (!error.response) {
    return REFRESH_ERROR_TYPES.NETWORK;
  }
  
  const status = error.response.status;
  
  switch (status) {
    case 403:
      return REFRESH_ERROR_TYPES.EXPIRED;
    case 401:
      return REFRESH_ERROR_TYPES.INVALID;
    case 500:
    case 502:
    case 503:
    case 504:
      return REFRESH_ERROR_TYPES.SERVER;
    default:
      return REFRESH_ERROR_TYPES.UNKNOWN;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
//   console.log("🧹 Clearing authentication data...");
  
  // Clear localStorage
  localStorage.removeItem('user');
  
  // Clear cookies (client-side cleanup)
  const cookiesToClear = ['access', 'refresh'];
  cookiesToClear.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  });
  
//   console.log("✅ Authentication data cleared");
};

/**
 * Handle refresh token error with appropriate action
 * @param {Error} error - The refresh token error
 * @param {Object} options - Options for error handling
 * @param {boolean} options.redirectToLogin - Whether to redirect to login (default: true)
 * @param {string} options.loginPath - Login path for redirect (default: /auth/login)
 * @param {Function} options.onError - Custom error handler
 */
export const handleRefreshTokenError = (error, options = {}) => {
  const {
    redirectToLogin = true,
    loginPath = '/auth/login',
    onError
  } = options;
  
  const errorType = categorizeRefreshError(error);
  
//   console.error("🚫 Refresh token error:", {
    type: errorType,
    status: error.response?.status,
    message: error.message,
    response: error.response?.data
  });
  
  // Log specific error messages
  switch (errorType) {
    case REFRESH_ERROR_TYPES.EXPIRED:
//       console.error("🕒 Refresh token has expired. User needs to login again.");
      break;
    case REFRESH_ERROR_TYPES.INVALID:
//       console.error("🔐 Refresh token is invalid or malformed.");
      break;
    case REFRESH_ERROR_TYPES.NETWORK:
//       console.error("🌐 Network error occurred during token refresh.");
      break;
    case REFRESH_ERROR_TYPES.SERVER:
//       console.error("🖥️ Server error occurred during token refresh.");
      break;
    default:
//       console.error("❓ Unknown error occurred during token refresh.");
  }
  
  // Clear auth data for expired/invalid tokens
  if (errorType === REFRESH_ERROR_TYPES.EXPIRED || errorType === REFRESH_ERROR_TYPES.INVALID) {
    clearAuthData();
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorType);
    }
    
    // Redirect to login
    if (redirectToLogin) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
//       console.log("🔄 Redirecting to login:", redirectUrl);
      window.location.href = redirectUrl;
    }
  }
  
  return errorType;
};

/**
 * Attempt to refresh token with proper error handling
 * @param {Object} options - Options for refresh attempt
 * @returns {Promise<boolean>} Success status
 */
export const attemptTokenRefresh = async (options = {}) => {
  try {
//     console.log("🔄 Attempting token refresh...");
    
    const result = await refreshToken();
    
    if (result) {
//       console.log("✅ Token refresh successful");
      return true;
    } else {
//       console.log("❌ Token refresh returned empty result");
      return false;
    }
    
  } catch (error) {
//     console.error("❌ Token refresh failed:", error);
    handleRefreshTokenError(error, options);
    return false;
  }
};

/**
 * Check if error is a refresh token error
 * @param {Error} error - Error to check
 * @returns {boolean} Whether error is refresh token related
 */
export const isRefreshTokenError = (error) => {
  return error.response?.status === 403 || error.response?.status === 401;
};

export default {
  REFRESH_ERROR_TYPES,
  categorizeRefreshError,
  clearAuthData,
  handleRefreshTokenError,
  attemptTokenRefresh,
  isRefreshTokenError
};
