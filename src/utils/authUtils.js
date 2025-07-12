import { isAuthenticated, getCurrentTokenData, refreshToken } from '@services/JWTService.jsx';
import { getLoginURL, getEnrollmentRoute } from '../constants/routes';

/**
 * Check if user is authenticated and handle enrollment access
 * Returns object with authentication status and action to take
 */
export const checkEnrollmentAccess = async () => {
  try {
//     console.log("🔐 checkEnrollmentAccess - *** FUNCTION CALLED ***");
//     console.log("🔐 checkEnrollmentAccess - Starting authentication check");
    
    // First check if user has a valid token
    const isAuth = isAuthenticated();
//     console.log("🔐 checkEnrollmentAccess - isAuthenticated():", isAuth);
    
    if (isAuth) {
      const tokenData = getCurrentTokenData();
//       console.log("🔐 checkEnrollmentAccess - Token data:", tokenData ? { role: tokenData.role, exp: tokenData.exp } : "null");
      
      if (!tokenData) {
//         console.warn("🔐 checkEnrollmentAccess - isAuthenticated() true but getCurrentTokenData() null");
        return {
          isAuthenticated: false,
          action: 'require_login',
          message: 'Token data inconsistent. Please login again.'
        };
      }
      
      // Check if token is about to expire (within 5 minutes)
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenData.exp - currentTime;
      const fiveMinutes = 5 * 60;
      
//       console.log("🔐 checkEnrollmentAccess - Time until expiry:", timeUntilExpiry, "seconds");
//       console.log("🔐 checkEnrollmentAccess - Current time:", currentTime);
//       console.log("🔐 checkEnrollmentAccess - Token expires at:", tokenData.exp);
      
      if (timeUntilExpiry > fiveMinutes) {
        // Token is valid and has sufficient time left
//         console.log("🔐 checkEnrollmentAccess - Token valid, access granted");
        return {
          isAuthenticated: true,
          action: 'allow',
          user: tokenData,
          message: 'Access granted'
        };
      } else if (timeUntilExpiry > 0) {
        // Token is valid but expires soon, try to refresh
//         console.log("🔐 checkEnrollmentAccess - Token expires soon, attempting refresh");
        try {
//           console.log("🔄 checkEnrollmentAccess - Calling refreshToken()...");
          await refreshToken();
//           console.log("✅ checkEnrollmentAccess - refreshToken() completed successfully");
          
          const newTokenData = getCurrentTokenData();
//           console.log("🔍 checkEnrollmentAccess - New token data after refresh:", newTokenData ? { role: newTokenData.role, exp: newTokenData.exp } : "null");
          
          if (newTokenData) {
//             console.log("✅ checkEnrollmentAccess - Token refresh successful, granting access");
            return {
              isAuthenticated: true,
              action: 'allow',
              user: newTokenData,
              message: 'Token refreshed, access granted'
            };
          } else {
//             console.warn("⚠️ checkEnrollmentAccess - refreshToken() succeeded but newTokenData is null");
          }
        } catch (refreshError) {
//           console.error('❌ checkEnrollmentAccess - Token refresh failed with error:', refreshError);
//           console.error('❌ checkEnrollmentAccess - Error details:', {
            
          // Fall through to require login
        }
      } else {
//         console.log("🔐 checkEnrollmentAccess - Token expired");
      }
    } else {
//       console.log("🔐 checkEnrollmentAccess - User not authenticated");
    }
    
    // No valid token or refresh failed
//     console.log("🔐 checkEnrollmentAccess - Requiring login");
    return {
      isAuthenticated: false,
      action: 'require_login',
      message: 'Authentication required. Please login to continue.'
    };
    
  } catch (error) {
//     console.error('🔐 checkEnrollmentAccess - Error:', error);
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
  const { showNotification, redirectPath } = options;
  
  try {
//     console.log("🎯 handleEnrollmentNavigation - Starting enrollment navigation");
//     console.log("🎯 handleEnrollmentNavigation - About to call checkEnrollmentAccess");
    
    const authCheck = await checkEnrollmentAccess();
    
//     console.log("🎯 handleEnrollmentNavigation - Auth check completed");
//     console.log("🎯 handleEnrollmentNavigation - Auth check result:", authCheck);
    
    if (authCheck.action === 'allow') {
      // User is authenticated, get appropriate route based on role
      const userRole = authCheck.user?.role;
//       console.log("🎯 handleEnrollmentNavigation - User role:", userRole);
      
      // If a specific redirectPath is provided, use it; otherwise use role-based route
      const targetRoute = redirectPath || getEnrollmentRoute(userRole);
//       console.log("🎯 handleEnrollmentNavigation - Target route:", targetRoute);
      
      // Navigate to the target route
      navigate(targetRoute);
      
     
      
      return true;
    } else {
      // User needs to login first
      const currentUrl = window.location.pathname;
      
      // For unauthenticated users, redirect to public enrollment route after login
      const targetEnrollmentRoute = redirectPath || "/user/parent/add-child";
      
      // Create login URL with proper redirect parameters
      const loginUrl = getLoginURL(targetEnrollmentRoute, currentUrl);
      
//       console.log("🔐 handleEnrollmentNavigation - Redirecting to login:", {
        
      
      navigate(loginUrl);
      
      if (showNotification) {
        showNotification('Vui lòng đăng nhập để tiếp tục đăng ký nhập học', 'warning');
      }
      
      return false;
    }
  } catch (error) {
//     console.error('🚫 handleEnrollmentNavigation - Error:', error);
    
    // Fallback to login page with default enrollment route
    const defaultEnrollmentRoute = "/user/parent/forms";
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
