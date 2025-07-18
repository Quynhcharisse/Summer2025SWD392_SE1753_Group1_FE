import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {refreshToken} from "@services/JWTService.jsx";
import { useState, useEffect } from "react";

export default function ProtectedRoute({children, requiredRoles = []}) {
    const [isChecking, setIsChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const accessToken = Cookies.get("access");
                
                if (accessToken) {
                    try {
                        const decoded = jwtDecode(accessToken);
                        const userRole = decoded.role;
                        
                        // If no roles required, allow access
                        if (requiredRoles.length === 0) {
                            setHasAccess(true);
                            setIsChecking(false);
                            return;
                        }
                        
                        // Check if user has required role
                        if (requiredRoles.includes(userRole)) {
                            setHasAccess(true);
                        } else {
                            setHasAccess(false);
                        }
                        setIsChecking(false);
                        return;
                    } catch (decodeError) {
                        console.error("Token decode error:", decodeError);
                        // Token is malformed, try refresh
                    }
                }

                // No token or malformed token, try refresh
                try {
                    console.log("No valid token, attempting refresh...");
                    const response = await refreshToken();
                    
                    if (response && response.status === 200) {
                        // Check the new token
                        const newAccessToken = Cookies.get("access");
                        if (newAccessToken) {
                            const decoded = jwtDecode(newAccessToken);
                            const userRole = decoded.role;
                            
                            if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
                                setHasAccess(true);
                            } else {
                                setHasAccess(false);
                            }
                        } else {
                            setHasAccess(false);
                        }
                    } else {
                        setHasAccess(false);
                    }
                } catch (refreshError) {
                    console.error("Refresh failed:", refreshError);
                    setHasAccess(false);
                }
            } catch (error) {
                console.error("ProtectedRoute error:", error);
                setHasAccess(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkAccess();
    }, [requiredRoles]);

    // Show loading while checking
    if (isChecking) {
        return <div className="flex items-center justify-center min-h-screen">
            <div>Loading...</div>
        </div>;
    }

    // Redirect to login if no access
    if (!hasAccess) {
        window.location.href = "/auth/login";
        return null;
    }

    // Render children if has access
    return children;
}