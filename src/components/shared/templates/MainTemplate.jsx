import { Footer, Header } from "@organisms";
import { themeClasses } from '@theme/colors';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { refreshToken } from '@services/JWTService.jsx';
import Cookies from 'js-cookie';

const MainTemplate = ({ children }) => {
  const intervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const trackActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const checkAndRefreshToken = async () => {
      try {
        const accessToken = Cookies.get("access");
        if (!accessToken) return;

        // Parse token để lấy expiry time
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = tokenData.exp - currentTime;

        // Chỉ refresh nếu:
        // 1. Token sắp hết hạn (< 2 phút)
        // 2. User có hoạt động gần đây (< 10 phút)
        const timeSinceActivity = Date.now() - lastActivityRef.current;
        const tenMinutes = 10 * 60 * 1000;
        const isUserActive = timeSinceActivity < tenMinutes;

        if (timeUntilExpiry > 0 && timeUntilExpiry <= 120 && isUserActive) {
          console.log("🔄 MainTemplate - Auto refreshing token for active user...");
          await refreshToken();
          console.log("✅ MainTemplate - Token refreshed successfully");
        }
      } catch (error) {
        console.error("❌ MainTemplate - Auto refresh failed:", error);
      }
    };

    // Track user activity
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, trackActivity, { passive: true });
    });

    // Initial activity mark
    trackActivity();

    // Check mỗi 30 giây
    intervalRef.current = setInterval(checkAndRefreshToken, 30000);

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, trackActivity);
      });
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses.backgroundSurface} ${themeClasses.textPrimary}`}>
      <Header />
      <main className={`flex-1 container mx-auto p-4 ${themeClasses.backgroundSurface}`}>{children}</main>
      <Footer />
    </div>
  );
};

MainTemplate.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainTemplate;
