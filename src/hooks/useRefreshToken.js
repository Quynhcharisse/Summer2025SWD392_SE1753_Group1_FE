import { useEffect } from "react";
import { refreshToken } from "../api/services/JWTService";
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        // Nếu chưa có accessToken hoặc accessToken hết hạn (cần bổ sung logic kiểm tra hết hạn nếu có)
        if (!auth?.accessToken) {
          const data = await refreshToken();
          if (isMounted) {
            setAuth((prev) => ({
              ...prev,
              accessToken: data.accessToken,
              user: data.user,
            }));
          }
        }
      } catch (err) {
        setAuth(null);
      }
    };

    verifyRefreshToken();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  return null;
};

export default useRefreshToken;
