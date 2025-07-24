import apiClient from "@api/apiClient";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const getCurrentTokenData = () => {
  let accessToken = Cookies.get("access");
  console.log("access: ", accessToken);
  if (!accessToken) {
    // Fallback: try to get from localStorage (for compatibility)
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj?.token) {
          accessToken = userObj.token;
        }
      } catch (e) {
        console.warn(
          "🔍 getCurrentTokenData - Failed to parse localStorage user data:",
          e.message
        );
      }
    }
  }
  if (accessToken) {
    localStorage.setItem("user", JSON.stringify({ token: accessToken }));
  }
  return decodeToken(accessToken);
};

export const isAuthenticated = () => {
  return !!getCurrentTokenData();
};

export const hasRole = (requiredRole) => {
  const tokenData = getCurrentTokenData();
  if (!tokenData || !tokenData.role) {
    return false;
  }

  return tokenData.role.toLowerCase() === requiredRole.toLowerCase();
};

export const hasAnyRole = (roles = []) => {
  const tokenData = getCurrentTokenData();
  if (!tokenData || !tokenData.role) {
    return false;
  }

  return roles.some(
    (role) => tokenData.role.toLowerCase() === role.toLowerCase()
  );
};

export const refreshToken = async () => {
  const response = await apiClient.post("/auth/refresh");
  return response || null;
};
