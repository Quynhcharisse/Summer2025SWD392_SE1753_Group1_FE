/**
 * Protected Route Component
 * Handles route protection based on user authentication and roles
 */
import { refreshToken, decodeToken } from "@services/JWTService.jsx";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { Navigate, useNavigate } from "react-router-dom";
import { roleMiddleware } from "./roleMiddleware";
import { jwtDecode } from "jwt-decode";
import { AUTH_ROUTES } from "../constants/routes";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const accessToken = Cookies.get("access");
  const checkToken = Cookies.get("check");

  console.log("ProtectedRoute Debug:", {
    accessToken: accessToken ? "exists" : "missing",
    checkToken: checkToken ? "exists" : "missing",
    allowedRoles,
  });  // No authentication tokens found
  if (!accessToken && !checkToken) {
    console.log("No tokens found, redirecting to login");
    console.log("You are not authenticated"); // Replace notification logic
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  // Check access token if available
  if (accessToken) {
    try {
      const decoded = decodeToken(accessToken);
      console.log("Token decoded successfully:", {
        role: decoded.role,
        allowedRoles,
      });

      const decodedToken = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);      if (decodedToken.exp < currentTime) {
        console.log("Access token expired. Redirecting to login.");
        return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
      }

      // Check if user role is allowed
      if (
        allowedRoles.length > 0 &&
        !roleMiddleware(allowedRoles)(decoded.role)
      ) {
        console.log("Access denied for role:", decoded.role);
        console.log("You don't have permission to access this page", {
          variant: "error",
        });
        // Should create an UNAUTHORIZED route in routes.js if needed
        return <Navigate to="/" replace />;
      }

      console.log("Access granted for role:", decoded.role);
      return children;
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }

  // Try to refresh token if check token exists
  if (checkToken) {
    refreshToken()      .then((res) => {
        if (res && res.success) {
          window.location.reload();
        } else {
          navigate(AUTH_ROUTES.LOGIN);
        }
      })
      .catch((error) => {
        console.error("Token refresh failed:", error);
        navigate(AUTH_ROUTES.LOGIN);
      });

    // Show loading state while refreshing
    return <div>Authenticating...</div>;
  }
  // Fallback to login
  return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export { ProtectedRoute };
