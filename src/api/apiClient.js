import axios from "axios";
import Cookies from "js-cookie";
import {refreshToken} from "@services/JWTService.jsx";

// Create a custom event for auth failures
const authFailureEvent = new Event('authFailure');

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Quan trọng: cho phép gửi cookies trong cross-origin requests
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        if (originalRequest.url === "/auth/refresh") {
//           console.error("Refresh token request failed");
          // Dispatch auth failure event instead of direct navigation
          window.dispatchEvent(authFailureEvent);
          return Promise.reject(error);
        }

        try {
          const refreshRes = await refreshToken();
          if (refreshRes.success) {
            return apiClient(originalRequest);
          } else {
            // Dispatch auth failure event instead of direct navigation
            window.dispatchEvent(authFailureEvent);
          }
        } catch (refreshError) {
//           console.error("Refresh token request failed", refreshError);
          // Dispatch auth failure event instead of direct navigation
          window.dispatchEvent(authFailureEvent);
        }
      }

      return Promise.reject(error)
    }
);

export default apiClient;
