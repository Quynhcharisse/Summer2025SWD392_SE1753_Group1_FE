import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentTokenData, isAuthenticated, hasRole, hasAnyRole } from '@services/JWTService.jsx';
import { authService } from '@api/services/authService';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
        loading: true
    });

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const checkAuthStatus = async () => {
        try {
            const accessToken = Cookies.get("access");
            const isAuth = !!accessToken;
            const tokenData = accessToken ? parseJwt(accessToken) : null;

            if (!isAuth && Cookies.get("refresh")) {
                // Try to refresh the token
                try {
                    await authService.refreshToken();
                    const newAccessToken = Cookies.get("access");
                    const newTokenData = newAccessToken ? parseJwt(newAccessToken) : null;
                    
                    setAuth({
                        isAuthenticated: !!newAccessToken,
                        user: newTokenData,
                        loading: false
                    });
                    return;
                } catch (error) {
                    console.error("Failed to refresh token:", error);
                }
            }

            setAuth({
                isAuthenticated: isAuth,
                user: tokenData,
                loading: false
            });
        } catch (error) {
            console.error("Error checking auth status:", error);
            setAuth({
                isAuthenticated: false,
                user: null,
                loading: false
            });
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        auth,
        setAuth,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 