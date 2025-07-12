import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { authService } from "@api/services/authService";
import Cookies from "js-cookie";

const useRefreshToken = (options = {}) => {
  const {
    checkInterval = 60000, // Check every 1 minute
    refreshThreshold = 300, // Refresh if token expires in 5 minutes
    enablePeriodicCheck = true
  } = options;
  
  const intervalRef = useRef(null);
  const { setAuth } = useAuth();

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkAndRefreshToken = async () => {
      try {
        const accessToken = Cookies.get("access");
        if (!accessToken) {
//           console.log("🔄 useRefreshToken - No access token found");
          return;
        }

        const tokenData = parseJwt(accessToken);
        if (!tokenData) {
//           console.log("🔄 useRefreshToken - Invalid token format");
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = tokenData.exp - currentTime;

//         console.log(`🔄 useRefreshToken - Token expires in ${timeUntilExpiry} seconds`);

        // Refresh if token expires within threshold
        if (timeUntilExpiry > 0 && timeUntilExpiry <= refreshThreshold) {
//           console.log("🔄 useRefreshToken - Token expires soon, refreshing...");
          
          const response = await authService.refreshToken();
          if (response) {
            // The server will set the new access token cookie automatically
//             console.log("✅ useRefreshToken - Token refresh successful");
            
            // Update auth context if needed
            if (setAuth) {
              setAuth(prev => ({
                ...prev,
                isAuthenticated: true
              }));
            }
          }
        } else if (timeUntilExpiry <= 0) {
//           console.log("🔄 useRefreshToken - Token expired, attempting refresh...");
          
          try {
            await authService.refreshToken();
//             console.log("✅ useRefreshToken - Expired token refresh successful");
            
            // Update auth context if needed
            if (setAuth) {
              setAuth(prev => ({
                ...prev,
                isAuthenticated: true
              }));
            }
          } catch (error) {
//             console.error("❌ useRefreshToken - Failed to refresh expired token:", error);
            // Update auth context to reflect failed authentication
            if (setAuth) {
              setAuth(prev => ({
                ...prev,
                isAuthenticated: false
              }));
            }
          }
        }
      } catch (error) {
//         console.error("❌ useRefreshToken - Error during token check:", error);
      }
    };

    // Initial check
    checkAndRefreshToken();

    // Set up periodic checking if enabled
    if (enablePeriodicCheck) {
      intervalRef.current = setInterval(() => {
        if (isMounted) {
          checkAndRefreshToken();
        }
      }, checkInterval);
    }

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkInterval, refreshThreshold, enablePeriodicCheck, setAuth]);

  return null;
};

export default useRefreshToken;
