import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userCheck } from "../../services/apis";
import { useEffect } from "react";

const Protected = ({ children }) => {
    const navigate = useNavigate();

    const isUserLogged = async () => {
        try {
            const res = await axios.get(userCheck, {
                withCredentials: true
            });
            const user = res?.data;
            if (!user?.user) {
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error("Failed to check if user is logged in:", error);
            navigate('/login', { replace: true });
        }
    };
    
    useEffect(() => {
        isUserLogged();
    }, []); 
    return children;
}

export default Protected;
