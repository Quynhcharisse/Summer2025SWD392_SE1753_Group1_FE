/**
 * Protected Route Component - JWT + Cookie Implementation
 * Handles route protection based on user authentication and roles using:
 * - Access token in regular cookie (contains role for client-side logic)
 * - Refresh token in HttpOnly cookie (automatically managed by server)
 */
import { Navigate } from "react-router-dom";
import { getCurrentTokenData, hasAnyRole, isTokenExpired, hasAccessToken } from "@services/JWTService.jsx";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        checkAuthentication();
    }, [allowedRoles]);    const attemptTokenRefresh = async () => {
        console.log("🔄 Access token expired, attempting refresh...");
        
        try {
            const { refreshToken } = await import('@services/JWTService.jsx');
            await refreshToken();
            
            const tokenData = getCurrentTokenData();
            if (!tokenData) {
                console.log("❌ Token refresh failed or returned invalid token");
                return null;
            }
            
            console.log("✅ Token refresh successful");
            return tokenData;
        } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError);
            return null;
        }
    };

    const checkAuthentication = async () => {
        try {
            let tokenData = getCurrentTokenData();
            
            // Handle missing or expired token
            if (!tokenData) {
                if (isTokenExpired()) {
                    tokenData = await attemptTokenRefresh();
                } else if (!hasAccessToken()) {
                    console.log("❌ No access token found");
                } else {
                    console.log("❌ Invalid access token");
                }
                
                if (!tokenData) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }
            }

            // User is authenticated
            setIsAuthenticated(true);

            // Check role permissions
            if (allowedRoles.length > 0) {
                const hasRequiredRole = hasAnyRole(allowedRoles);
                setHasPermission(hasRequiredRole);
                
                if (!hasRequiredRole) {
                    console.warn(`Access denied. Required roles: ${allowedRoles.join(', ')}, User role: ${tokenData.role}`);
                }
            } else {
                setHasPermission(true);
            }

        } catch (error) {
            console.error("Authentication check failed:", error);
            setIsAuthenticated(false);
            setHasPermission(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Checking authentication...</span>
            </div>
        );
    }    // Not authenticated - redirect to login with current path
    if (!isAuthenticated) {
        const currentPath = window.location.pathname;
        const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        console.log("🔐 ProtectedRoute - Redirecting to login:", loginUrl);
        return <Navigate to={loginUrl} replace />;
    }

    // Authenticated but no permission - redirect to unauthorized
    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }    // Authenticated and has permission - render children
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;
