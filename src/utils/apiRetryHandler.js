/**
 * API Retry Handler Utility
 * Provides automatic retry mechanism for API calls when access token expires
 */
import { refreshToken, isTokenExpired, getCurrentTokenData } from '@services/JWTService.jsx';

/**
 * Prepare for API execution by refreshing token if needed
 * @param {boolean} refreshOnFirst - Whether to refresh before first attempt
 */
const prepareForExecution = async (refreshOnFirst) => {
  if (refreshOnFirst && isTokenExpired()) {
    console.log('🔄 Token expired, refreshing before API call...');
    
    try {
      await refreshToken();
      console.log('✅ Token refreshed successfully before API call');
    } catch (refreshError) {
      console.error('❌ Pre-call token refresh failed:', refreshError);
      // Continue with the API call anyway, let it fail naturally
    }
  }
};

/**
 * Handle API call retry logic
 * @param {Error} error - The error from API call
 * @param {number} retryCount - Current retry count
 * @param {number} maxRetries - Maximum retries allowed
 * @returns {boolean} Whether to retry the call
 */
const shouldRetryApiCall = async (error, retryCount, maxRetries) => {
  const isAuthError = error.response?.status === 401 || error.response?.status === 403;
  
  if (!isAuthError || retryCount >= maxRetries) {
    return false;
  }
  
  console.log(`🔄 API call failed with ${error.response.status}, attempting token refresh (retry ${retryCount + 1}/${maxRetries})...`);
  
  try {
    await refreshToken();
    const newTokenData = getCurrentTokenData();
    
    if (!newTokenData) {
      console.error('❌ Token refresh succeeded but no valid token data');
      throw new Error('Token refresh failed - no valid token data');
    }
    
    console.log('✅ Token refresh successful, retrying API call...');
    return true;
    
  } catch (refreshError) {
    console.error('❌ Token refresh failed during retry:', refreshError);
    throw refreshError;
  }
};

/**
 * Execute API call with automatic retry on token expiration
 * @param {Function} apiCall - The API call function to execute
 * @param {Object} options - Options for retry behavior
 * @param {number} options.maxRetries - Maximum number of retries (default: 1)
 * @param {boolean} options.refreshOnFirst - Whether to refresh token before first attempt if expired (default: true)
 * @returns {Promise} API call result
 */
export const executeWithRetry = async (apiCall, options = {}) => {
  const { maxRetries = 1, refreshOnFirst = true } = options;
  
  // Prepare for execution
  await prepareForExecution(refreshOnFirst);
  
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      // Execute the API call
      return await apiCall();
      
    } catch (error) {
      const shouldRetry = await shouldRetryApiCall(error, retryCount, maxRetries);
      
      if (shouldRetry) {
        retryCount++;
        continue; // Retry the API call
      }
      
      // Either not an auth error, or we've exhausted retries
      if (error.response?.status === 401 || error.response?.status === 403) {
        if (retryCount >= maxRetries) {
          console.error(`❌ API call failed after ${maxRetries} retries with auth error`);
        }
      }
      throw error; // Throw the original error
    }
  }
};

/**
 * Higher-order function to wrap API service methods with retry logic
 * @param {Function} apiServiceMethod - The API service method to wrap
 * @param {Object} retryOptions - Options for retry behavior
 * @returns {Function} Wrapped API service method
 */
export const withRetry = (apiServiceMethod, retryOptions = {}) => {
  return async (...args) => {
    return executeWithRetry(() => apiServiceMethod(...args), retryOptions);
  };
};

/**
 * Pre-configured retry wrapper for profile-related API calls
 */
export const executeProfileApiWithRetry = (apiCall) => {
  return executeWithRetry(apiCall, {
    maxRetries: 1,
    refreshOnFirst: true
  });
};

export default {
  executeWithRetry,
  withRetry,
  executeProfileApiWithRetry
};
