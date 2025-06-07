import axios from "axios";
import { handleRefreshTokenError, isRefreshTokenError } from "@/utils/refreshTokenErrorHandler";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Essential for cookie-based JWT authentication
});

// Response interceptor for handling token expiration and auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized or 403 Forbidden - Token expired or invalid
    if (isRefreshTokenError(error) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log("🔄 Attempting token refresh due to", error.response?.status, "error");
          // Attempt to refresh the token using HttpOnly refresh cookie
        // Server will automatically read refresh token from HttpOnly cookie
        const refreshResponse = await apiClient.post("/auth/refresh");
        
        if (refreshResponse.status === 200) {
          console.log("✅ Token refresh successful");
          // Server sets new access token in regular cookie
          // Retry the original request
          return apiClient.request(originalRequest);
        }
        
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        
        // Use centralized error handler
        handleRefreshTokenError(refreshError, {
          redirectToLogin: true,
          loginPath: "/auth/login"
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
