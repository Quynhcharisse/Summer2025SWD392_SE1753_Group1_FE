import { useEffect, useRef } from "react";
import { refreshToken, getCurrentTokenData, isAuthenticated } from "@services/JWTService.jsx";
import { useAuth } from "./useAuth";

const useRefreshToken = (options = {}) => {
  const {
    checkInterval = 60000, // Check every 1 minute
    refreshThreshold = 300, // Refresh if token expires in 5 minutes
    enablePeriodicCheck = true
  } = options;
  
  const intervalRef = useRef(null);
  const { setAuth, auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const checkAndRefreshToken = async () => {
      try {
        if (!isAuthenticated()) {
          console.log("🔄 useRefreshToken - User not authenticated, skipping refresh");
          return;
        }

        const tokenData = getCurrentTokenData();
        if (!tokenData) {
          console.log("🔄 useRefreshToken - No token data found");
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = tokenData.exp - currentTime;

        console.log(`🔄 useRefreshToken - Token expires in ${timeUntilExpiry} seconds`);

        // Refresh if token expires within threshold
        if (timeUntilExpiry > 0 && timeUntilExpiry <= refreshThreshold) {
          console.log("🔄 useRefreshToken - Token expires soon, refreshing...");
          
          await refreshToken();
          console.log("✅ useRefreshToken - Token refresh successful");
        } else if (timeUntilExpiry <= 0) {
          console.log("🔄 useRefreshToken - Token expired, attempting refresh...");
          
          try {
            await refreshToken();
            console.log("✅ useRefreshToken - Expired token refresh successful");
          } catch (error) {
            console.error("❌ useRefreshToken - Failed to refresh expired token:", error);
          }
        }
      } catch (error) {
        console.error("❌ useRefreshToken - Error during token check:", error);
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
  }, [checkInterval, refreshThreshold, enablePeriodicCheck]);

  return null;
};

export default useRefreshToken;
