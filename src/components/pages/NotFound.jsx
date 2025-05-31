import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate("/login");
        }, 2000); // Wait 2 seconds before redirecting

        return () => clearTimeout(timeout);
    }, [navigate]);

    return (
        <div style={{textAlign: "center", marginTop: "100px"}}>
            <h1>404 - Page Not Found</h1>
            <p>You will be redirected to the login page shortly...</p>
        </div>
    );
};

export default NotFound
