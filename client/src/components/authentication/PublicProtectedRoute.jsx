import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthProtected = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const userIn = localStorage.getItem('token');

    useEffect(()=>{
        if(userIn?.length){
            const from = location.state?.from?.pathname || '/';
            console.log(from, "FROM???")
            navigate(`${from}`, { replace: true });
        };
    }, [navigate]);
    

    return children;
};

export default AuthProtected;
