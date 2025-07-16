import apiClient from "@api/apiClient";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

/**
 * JWT Service for Cookie-based authentication
 * Access token is stored in regular cookie for role-based UI logic
 * Refresh token is stored in HttpOnly cookie (automatically managed by server)
 * 
 * IMPORTANT: Server handles all token refresh automatically via HttpOnly cookies
 * FE only needs to read access token for role-based UI logic
 */

/**
 * Decode JWT token to extract user data and roles
 * Used for client-side role checking and UI logic
 */
export const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        return null;
    }
};

/**
 * Get access token from cookie and decode it
 * Returns user info including role for UI logic
 * Server automatically refreshes expired tokens via HttpOnly cookie
 */
export const getCurrentTokenData = () => {
    let accessToken = Cookies.get("access");

    console.log("🔍 getCurrentTokenData - Cookie access token:", accessToken ? "exists" : "missing");

    if (!accessToken) {
        // Fallback: try to get from localStorage (for compatibility)
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj?.token) {
                    accessToken = userObj.token;
                    console.log("🔍 getCurrentTokenData - Found token in localStorage fallback");
                }
            } catch (e) {
                console.warn("🔍 getCurrentTokenData - Failed to parse localStorage user data:", e.message);
            }
        }
    }

    if (!accessToken) {
        console.log("🔍 getCurrentTokenData - No access token found");
        return null;
    }

    const decoded = decodeToken(accessToken);
    console.log("🔍 getCurrentTokenData - Decoded token:", decoded ? "valid" : "invalid");
    return decoded;
};

/**
 * Check if there's an access token (for UI logic only)
 * Server handles token validity automatically
 */
export const hasAccessToken = () => {
    let accessToken = Cookies.get("access");
    if (!accessToken) {
        // Fallback: try to get from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj?.token) {
                    accessToken = userObj.token;
                }
            } catch (e) {
                // ignore
            }
        }
    }
    return !!accessToken;
};

/**
 * Check if user is authenticated (has valid access token for UI logic)
 * Server handles actual authentication and token refresh
 */
export const isAuthenticated = () => {
    console.log("🔍 isAuthenticated - Starting check");
    const tokenData = getCurrentTokenData();
    console.log("🔍 isAuthenticated - Token data:", tokenData ? "exists" : "null");
    console.log("🔍 isAuthenticated - Result:", !!tokenData);
    return !!tokenData;
};

/**
 * Check if user has specific role
 */
export const hasRole = (requiredRole) => {
    const tokenData = getCurrentTokenData();
    if (!tokenData || !tokenData.role) {
        return false;
    }

    return tokenData.role.toLowerCase() === requiredRole.toLowerCase();
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roles = []) => {
    const tokenData = getCurrentTokenData();
    if (!tokenData || !tokenData.role) {
        return false;
    }

    return roles.some(
        (role) => tokenData.role.toLowerCase() === role.toLowerCase()
    );
};

/**
 * Refresh access token using HttpOnly refresh cookie
 * Server automatically reads refresh token from HttpOnly cookie
 * This is mainly called by apiClient interceptor
 */
export const refreshToken = async () => {
    const response = await apiClient.post("/auth/refresh");
    return response || null
};

/**
 * Logout user and clear all authentication data
 * Server clears both regular and HttpOnly cookies
 */
export const logout = async () => {
    try {
        console.log("🚪 JWTService - Requesting logout from server...");
        const response = await apiClient.post("/auth/logout");

        // Clear client-side data
        localStorage.removeItem("user");

        // Clear any manually set cookies (backup cleanup)
        Cookies.remove("access");
        Cookies.remove("refresh");

        console.log("✅ JWTService - Logout successful");
        return response.data;
    } catch (error) {
        console.error("❌ JWTService - Logout failed:", error);

        // Even if server request fails, clear local data
        localStorage.removeItem("user");
        Cookies.remove("access");
        Cookies.remove("refresh");

        throw error;
    }
};
