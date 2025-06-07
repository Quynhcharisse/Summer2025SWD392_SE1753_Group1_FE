import apiClient from '@api/apiClient';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { handleRefreshTokenError } from '@/utils/refreshTokenErrorHandler';

/**
 * JWT Service for Cookie-based authentication
 * Access token is stored in regular cookie for role-based UI logic
 * Refresh token is stored in HttpOnly cookie (managed by server)
 */

/**
 * Decode JWT token to extract user data and roles
 * Used for client-side role checking and UI logic
 */
export const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        
        // Validate token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            console.warn("Token has expired");
            return null;
        }
        
        return decoded;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

/**
 * Get access token from cookie and decode it
 * Returns user info including role for UI logic
 */
export const getCurrentTokenData = () => {
    let accessToken = Cookies.get('access');
    if (!accessToken) {
        // Fallback: try to get from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj && userObj.token) {
                    accessToken = userObj.token;
                }
            } catch (e) {
                // ignore
            }
        }
    }
    if (!accessToken) {
        return null;
    }
    return decodeToken(accessToken);
};

/**
 * Check if there's an access token (even if expired)
 */
export const hasAccessToken = () => {
    let accessToken = Cookies.get('access');
    if (!accessToken) {
        // Fallback: try to get from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj && userObj.token) {
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
 * Check if access token exists but is expired
 */
export const isTokenExpired = () => {
    const hasToken = hasAccessToken();
    const tokenData = getCurrentTokenData();
    
    // If we have a token but getCurrentTokenData returns null, it means token is expired
    return hasToken && !tokenData;
};

/**
 * Check if user is authenticated by validating access token
 */
export const isAuthenticated = () => {
    const tokenData = getCurrentTokenData();
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
    
    return roles.some(role => 
        tokenData.role.toLowerCase() === role.toLowerCase()
    );
};

/**
 * Refresh access token using HttpOnly refresh cookie
 * Server automatically reads refresh token from HttpOnly cookie
 */
export const refreshToken = async () => {
    try {
        console.log("🔄 Refreshing access token...");
        const response = await apiClient.post("/auth/refresh");
        
        if (response.status === 200) {
            console.log("✅ Token refresh successful");
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
        
    } catch (error) {
        console.error("❌ Refresh token failed:", error);
        
        // Use centralized error handler
        handleRefreshTokenError(error, {
            redirectToLogin: false, // Don't redirect here, let the caller decide
        });
        
        throw error;
    }
};

/**
 * Logout user and clear all authentication data
 * Server clears both regular and HttpOnly cookies
 */
export const logout = async () => {
    try {
        const response = await apiClient.post("/auth/logout");
        
        // Clear client-side data
        localStorage.removeItem('user');
        
        // Clear any manually set cookies (backup)
        Cookies.remove('access');
        Cookies.remove('refresh');
        
        return response.data;
    } catch (error) {
        console.error("Logout failed:", error);
        
        // Even if server request fails, clear local data
        localStorage.removeItem('user');
        Cookies.remove('access');
        Cookies.remove('refresh');
        
        throw error;
    }
};
