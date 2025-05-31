import {Navigate, useNavigate} from "react-router-dom";
import {refreshToken} from "@/services/JWTService.jsx";
import {enqueueSnackbar} from "notistack";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({children, allowedRoles}) => {
    const navigate = useNavigate()
    const accessToken = Cookies.get('access');
    const checkToken = Cookies.get('check');

    if (!accessToken && !checkToken) {
        enqueueSnackbar("You are not authenticated", {variant: 'error'});
        return <Navigate to="/login"/>;
    }

    if (accessToken) {
        const decoded = jwtDecode(accessToken);
        if (decoded && allowedRoles.includes(decoded.role)) { //decode = giai ma
            return children
        } else {
            return null;
        }
    }

    refreshToken().then(res => {
        if (res.success) {
            window.location.reload();
        } else {
            navigate('/login')
        }
    })
}

export default ProtectedRoute