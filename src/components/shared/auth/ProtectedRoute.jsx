/**
 * Protected Route Component - JWT + Cookie Implementation
 * Handles route protection based on user authentication and roles using:
 * - Access token in regular cookie (contains role for client-side logic)
 * - Refresh token in HttpOnly cookie (automatically managed by server)
 */
import { Navigate } from "react-router-dom";
import { getCurrentTokenData, hasAnyRole } from "../../../api/services/JWTService";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        checkAuthentication();
    }, [allowedRoles]);

    const checkAuthentication = async () => {
        try {
            // Get token data from access token cookie
            const tokenData = getCurrentTokenData();
            
            if (!tokenData) {
                // No valid access token, not authenticated
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
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
                // No role restrictions
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
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated but no permission - redirect to unauthorized
    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }    // Authenticated and has permission - render children
    return children;
};

export default ProtectedRoute;
