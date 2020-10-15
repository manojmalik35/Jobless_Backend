import axiosInstance from "./createService";

const loginUser = (payload) =>{
    return axiosInstance.post("/users/login", payload);
}

export default loginUser;