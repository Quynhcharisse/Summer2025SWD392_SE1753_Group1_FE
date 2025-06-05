/**
 * Custom hook for authentication state management
 * Provides easy access to authentication status and user data
 */
import { useState, useEffect } from 'react';
import { getCurrentTokenData, isAuthenticated, hasRole, hasAnyRole } from '@/api/services/JWTService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            const tokenData = getCurrentTokenData();
            const isAuth = isAuthenticated();
            
            setAuthenticated(isAuth);
            setUser(tokenData);
        } catch (error) {
            console.error("Error checking auth status:", error);
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
        refreshAuthStatus,
    };
};

export default useAuth;
