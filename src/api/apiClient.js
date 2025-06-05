import axios from "axios";

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
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using HttpOnly refresh cookie
        // Server will automatically read refresh token from HttpOnly cookie
        const refreshResponse = await apiClient.post("/auth/refresh-token");
        
        if (refreshResponse.status === 200) {
          // Server sets new access token in regular cookie
          // Retry the original request
          return apiClient.request(originalRequest);
        }      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear any client-side auth state
        localStorage.removeItem('user');
        // Redirect to login
        window.location.href = "/auth/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
