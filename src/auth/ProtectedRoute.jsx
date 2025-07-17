import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {refreshToken} from "@services/JWTService.jsx";

async function RefreshToken() {
    const response = await refreshToken();

    if(response) {
        if(response.status === 401 || response.status === 403) {
            window.location.href = "/auth/login"
        } else {
            window.location.reload()
        }
    }
}
export default function ProtectedRoute({children, requiredRoles}) {
    const accessToken = Cookies.get("access");
    if (accessToken) {
        const role = jwtDecode(accessToken).role
        if(requiredRoles.includes(role)){
            return children;
        }
    }else{
        RefreshToken()
    }

}