/**
 * Custom hook for authentication state management
 * Provides easy access to authentication status and user data
 */
import { useState, useEffect } from 'react';
import { getCurrentTokenData, isAuthenticated, hasRole, hasAnyRole, isTokenExpired, refreshToken } from '@/api/services/JWTService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);    const checkAuthStatus = async () => {
        try {
            let tokenData = getCurrentTokenData();
            let isAuth = isAuthenticated();
            
            // If token is expired, try to refresh
            if (!isAuth && isTokenExpired()) {
                console.log("🔄 Token expired, attempting refresh...");
                
                try {
                    await refreshToken();
                    tokenData = getCurrentTokenData();
                    isAuth = isAuthenticated();
                    
                    if (isAuth) {
                        console.log("✅ Token refresh successful in useAuth");
                    }
                } catch (refreshError) {
                    console.error("❌ Token refresh failed in useAuth:", refreshError);
                }
            }
            
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
