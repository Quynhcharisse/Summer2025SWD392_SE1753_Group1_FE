import {
  getCurrentTokenData,
  isAuthenticated,
  refreshToken,
} from "@services/JWTService.jsx";
import { getEnrollmentRoute, getLoginURL } from "../constants/routes";

/**
 * Check if user is authenticated and handle enrollment access
 * Returns object with authentication status and action to take
 */
export const checkEnrollmentAccess = async () => {
  try {
    // First check if user has a valid token
    const isAuth = isAuthenticated();

    if (isAuth) {
      const tokenData = getCurrentTokenData();

      if (!tokenData) {
        return {
          isAuthenticated: false,
          action: "require_login",
          message: "Token data inconsistent. Please login again.",
        };
      }

      // Check if token is about to expire (within 5 minutes)
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenData.exp - currentTime;
      const fiveMinutes = 5 * 60;

      if (timeUntilExpiry > fiveMinutes) {
        // Token is valid and has sufficient time left
        //         console.log("🔐 checkEnrollmentAccess - Token valid, access granted");
        return {
          isAuthenticated: true,
          action: "allow",
          user: tokenData,
          message: "Access granted",
        };
      } else if (timeUntilExpiry > 0) {
        try {
          await refreshToken();

          const newTokenData = getCurrentTokenData();

          if (newTokenData) {
            return {
              isAuthenticated: true,
              action: "allow",
              user: newTokenData,
              message: "Token refreshed, access granted",
            };
          } else {
          }
        } catch (refreshError) {}
      } else {
      }
    } else {
    }

    return {
      isAuthenticated: false,
      action: "require_login",
      message: "Authentication required. Please login to continue.",
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      action: "require_login",
      message: "Authentication check failed. Please login to continue.",
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
    const authCheck = await checkEnrollmentAccess();
    if (authCheck.action === "allow") {
      // User is authenticated, get appropriate route based on role
      const userRole = authCheck.user?.role;
      // If a specific redirectPath is provided, use it; otherwise use role-based route
      const targetRoute = redirectPath || getEnrollmentRoute(userRole);
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

      navigate(loginUrl);

      if (showNotification) {
        showNotification(
          "Please log in to continue with enrollment registration",
          "warning"
        );
      }

      return false;
    }
  } catch (error) {
    // Fallback to login page with default enrollment route
    const defaultEnrollmentRoute = "/user/parent/forms";
    navigate(getLoginURL(defaultEnrollmentRoute));

    if (showNotification) {
      showNotification("An error occurred. Please login again.", "error");
    }

    return false;
  }
};

/**
 * Get user-friendly message for authentication status
 */
export const getAuthStatusMessage = (isAuth, tokenData) => {
  if (!isAuth) {
    return "You need to log in to register for enrollment";
  }

  if (tokenData) {
    const timeUntilExpiry = tokenData.exp - Math.floor(Date.now() / 1000);
    const hoursLeft = Math.floor(timeUntilExpiry / 3600);
    const minutesLeft = Math.floor((timeUntilExpiry % 3600) / 60);

    if (hoursLeft > 0) {
      return `Login session has ${hoursLeft} hour(s) ${minutesLeft} minute(s) remaining`;
    } else if (minutesLeft > 5) {
      return `Login session has ${minutesLeft} minutes remaining`;
    } else if (minutesLeft > 0) {
      return `Login session is about to expire (${minutesLeft} minute(s))`;
    } else {
      return "Login session has expired";
    }
  }

  return "";
};
