/**
 * Custom hook for authentication state management
 * Provides easy access to authentication status and user data
 * Server handles token refresh automatically via HttpOnly cookies
 */
import { useState, useEffect } from 'react';
import { getCurrentTokenData, isAuthenticated, hasRole, hasAnyRole } from '@services/JWTService.jsx';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            console.log("🔍 useAuth - Checking authentication status");
            
            // Simply check current token status (server handles refresh automatically)
            const tokenData = getCurrentTokenData();
            const isAuth = isAuthenticated();
            
            console.log("🔍 useAuth - Authentication check result:", {
                hasToken: !!tokenData,
                isAuthenticated: isAuth
            });
            
            setAuthenticated(isAuth);
            setUser(tokenData);
        } catch (error) {
            console.error("❌ useAuth - Error checking auth status:", error);
            setAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const checkRole = (role) => hasRole(role);
    const checkAnyRole = (roles) => hasAnyRole(roles);

    const refreshAuthStatus = () => {
        setLoading(true);
        checkAuthStatus();
    };

    return {
        user,
        loading,
        authenticated,
        checkRole,
        checkAnyRole,
        refreshAuthStatus
    };
};

export default useAuth;
