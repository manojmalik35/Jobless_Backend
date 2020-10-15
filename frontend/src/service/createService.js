import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_PATH,
    timeout: 30000,
});

export default axiosInstance;