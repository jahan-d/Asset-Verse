import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useEffect } from "react";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    useEffect(() => {
        axiosSecure.interceptors.request.use(function (config) {
            const token = localStorage.getItem('access-token');
            if (token) {
                config.headers.authorization = `Bearer ${token}`
            }
            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        // Intercept 401 and 403 status
        axiosSecure.interceptors.response.use(function (response) {
            return response;
        }, async (error) => {
            const status = error.response ? error.response.status : null;
            if (status === 401 || status === 403) {
                await logoutUser();
                navigate('/login');
            }
            return Promise.reject(error);
        })
    }, [navigate, logoutUser])

    return axiosSecure;
};

export default useAxiosSecure;
