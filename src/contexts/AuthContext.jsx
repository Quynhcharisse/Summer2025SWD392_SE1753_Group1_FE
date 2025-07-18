import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentTokenData, isAuthenticated, hasRole, hasAnyRole, refreshToken } from '@services/JWTService.jsx';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
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
                    await refreshToken();
                    const newAccessToken = Cookies.get("access");
                    const newTokenData = newAccessToken ? parseJwt(newAccessToken) : null;
                    
                    setAuth({
                        isAuthenticated: !!newAccessToken,
                        user: newTokenData,
                        loading: false
                    });
                    return;
                } catch (error) {
//                     console.error("Failed to refresh token:", error);
                }
            }

            setAuth({
                isAuthenticated: isAuth,
                user: tokenData,
                loading: false
            });
        } catch (error) {
//             console.error("Error checking auth status:", error);
            setAuth({
                isAuthenticated: false,
                user: null,
                loading: false
            });
        }
    };

    // Handle auth failure events - DISABLED for now to prevent unwanted redirects
    // useEffect(() => {
    //     const handleAuthFailure = () => {
    //         console.log("🚨 AuthContext - authFailure event received, redirecting to login");
    //         setAuth({
    //             isAuthenticated: false,
    //             user: null,
    //             loading: false
    //         });
    //         navigate('/auth/login');
    //     };

    //     window.addEventListener('authFailure', handleAuthFailure);
    //     return () => {
    //         window.removeEventListener('authFailure', handleAuthFailure);
    //     };
    // }, [navigate]);

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