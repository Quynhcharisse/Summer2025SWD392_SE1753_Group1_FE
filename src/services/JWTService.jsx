import axiosClient from '@api/ConfigAPI.jsx'

export const refreshToken = async () => {
    const response = await axiosClient.post("/auth/refresh")
    return response ? response.data : null
}