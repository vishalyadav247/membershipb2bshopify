import { useEffect } from "react";
import {useNavigate } from "react-router-dom";

const Protected = ({ children }) => {
    const navigate = useNavigate();

    const userIn = localStorage.getItem('token');

    useEffect(()=>{
        if(!userIn?.length){
           navigate('/login');
        };
    }, []);
    

    return children;
};

export default Protected;
