import { isAuthenticated, getCurrentTokenData, refreshToken } from '@services/JWTService.jsx';
import { getLoginURL, getEnrollmentRoute } from '../constants/routes';

/**
 * Check if user is authenticated and handle enrollment access
 * Returns object with authentication status and action to take
 */
export const checkEnrollmentAccess = async () => {
  try {
    // First check if user has a valid token
    if (isAuthenticated()) {
      const tokenData = getCurrentTokenData();
      
      // Check if token is about to expire (within 5 minutes)
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenData.exp - currentTime;
      const fiveMinutes = 5 * 60;
      
      if (timeUntilExpiry > fiveMinutes) {
        // Token is valid and has sufficient time left
        return {
          isAuthenticated: true,
          action: 'allow',
          user: tokenData,
          message: 'Access granted'
        };
      } else if (timeUntilExpiry > 0) {
        // Token is valid but expires soon, try to refresh
        try {
          await refreshToken();
          const newTokenData = getCurrentTokenData();
          
          if (newTokenData) {
            return {
              isAuthenticated: true,
              action: 'allow',
              user: newTokenData,
              message: 'Token refreshed, access granted'
            };
          }
        } catch (refreshError) {
          console.warn('Token refresh failed:', refreshError);
          // Fall through to require login
        }
      }
    }
    
    // No valid token or refresh failed
    return {
      isAuthenticated: false,
      action: 'require_login',
      message: 'Authentication required. Please login to continue.'
    };
    
  } catch (error) {
    console.error('Error checking enrollment access:', error);
    return {
      isAuthenticated: false,
      action: 'require_login',
      message: 'Authentication check failed. Please login to continue.'
    };
  }
};

/**
 * Handle navigation to enrollment with authentication check
 * @param {Function} navigate - React Router navigate function
 * @param {Object} options - Additional options
 * @returns {Promise<boolean>} - Whether navigation was successful
 */
export const handleEnrollmentNavigation = async (navigate, options = {}) => {
  const { showNotification } = options;
  
  try {
    const authCheck = await checkEnrollmentAccess();
    
    if (authCheck.action === 'allow') {
      // User is authenticated, get appropriate enrollment route based on role
      const userRole = authCheck.user?.role;
      const enrollmentRoute = getEnrollmentRoute(userRole);
      
      // Navigate to role-based enrollment route
      navigate(enrollmentRoute);
      
      if (showNotification) {
        showNotification('Chuyển đến trang đăng ký thành công', 'success');
      }
      
      return true;
    } else {
      // User needs to login first
      const currentUrl = window.location.pathname;
      // After login, redirect to appropriate enrollment route
      const userRole = authCheck.user?.role;
      const enrollmentRoute = getEnrollmentRoute(userRole);
      const loginUrl = getLoginURL(enrollmentRoute, currentUrl);
      
      navigate(loginUrl);
      
      if (showNotification) {
        showNotification('Vui lòng đăng nhập để tiếp tục đăng ký nhập học', 'warning');
      }
      
      return false;
    }
  } catch (error) {
    console.error('Error handling enrollment navigation:', error);
    
    // Fallback to login page with default enrollment route
    const defaultEnrollmentRoute = getEnrollmentRoute();
    navigate(getLoginURL(defaultEnrollmentRoute));
    
    if (showNotification) {
      showNotification('Đã xảy ra lỗi. Vui lòng đăng nhập lại.', 'error');
    }
    
    return false;
  }
};

/**
 * Get user-friendly message for authentication status
 */
export const getAuthStatusMessage = (isAuth, tokenData) => {
  if (!isAuth) {
    return 'Bạn cần đăng nhập để đăng ký nhập học';
  }
  
  if (tokenData) {
    const timeUntilExpiry = tokenData.exp - Math.floor(Date.now() / 1000);
    const hoursLeft = Math.floor(timeUntilExpiry / 3600);
    const minutesLeft = Math.floor((timeUntilExpiry % 3600) / 60);
    
    if (hoursLeft > 0) {
      return `Phiên đăng nhập còn ${hoursLeft} giờ ${minutesLeft} phút`;
    } else if (minutesLeft > 5) {
      return `Phiên đăng nhập còn ${minutesLeft} phút`;
    } else if (minutesLeft > 0) {
      return `Phiên đăng nhập sắp hết hạn (${minutesLeft} phút)`;
    } else {
      return 'Phiên đăng nhập đã hết hạn';
    }
  }
  
  return '';
};
