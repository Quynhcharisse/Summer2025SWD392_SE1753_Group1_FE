import axios from "axios";
import {refreshToken} from "@/services/JWTService.jsx";


axios.defaults.baseURL = "http://localhost:8080/api/v1"

// thay vì lúc nào cũng gọi http/localhost:8080.. thì cấu hình đường link ban đầu sẵn
const axiosClient = axios.create({
    baseURL: axios.defaults.baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true //cho phép cookie đc đi qua
})

axiosClient.interceptors.response.use( // config lại response
    response => response,
    async error => {
        const originalRequest = error.config

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (originalRequest.url === "/auth/refresh") {
                console.error("Refresh token request failed, redirecting to the login.");
                window.location.href = "/login"
                return Promise.reject(error)
            }

            try {
                const refreshRes = await refreshToken()
                if (refreshRes.success) {
                    return axiosClient(originalRequest)
                } else {
                    window.location.href = "/login"
                }
            } catch (refreshError) {
                console.error("Refresh token request failed", refreshError);
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
)

export default axiosClient;