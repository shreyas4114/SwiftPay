import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Me = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/signup');
        } else {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    return null; // This component doesn't render anything
};
