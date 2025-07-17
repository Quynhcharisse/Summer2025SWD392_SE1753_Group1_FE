import axios from "axios";
import {refreshToken} from "@services/JWTService.jsx";

axios.defaults.baseURL = "http://localhost:8080/api/v1"

const apiClient = axios.create({
  baseURL: axios.defaults.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        if (originalRequest.url === "/auth/refresh") {
          console.error("Refresh token request failed, redirecting to the login.");
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }

        try {
          const refreshRes = await refreshToken();
          // Check if refresh was successful (got a valid response)
          if (refreshRes && refreshRes.status === 200) {
            return apiClient(originalRequest);
          } else {
            console.error("Refresh token failed, redirecting to login");
            window.location.href = "/auth/login";
          }
        } catch (refreshError) {
          console.error("Refresh token request failed", refreshError);
          window.location.href = "/auth/login";
        }
      }
      return Promise.reject(error);
    }
)

export default apiClient;
