import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userCheck } from "../../services/apis";

const AuthProtected = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const checkUser = async () => {
        try {
            const res = await axios.get(userCheck, {
                withCredentials: true
            });
            const user = res?.data;
            console.log(user, "checkUser");

            if (user?.user) {
                const from = location.state?.from?.pathname || '/';
                console.log(from,"FROM???")
                navigate(`${from}`, { replace: true }); 
            }
        } catch (error) {
            console.error("Failed to verify user status:", error);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    return children;
};

export default AuthProtected;
