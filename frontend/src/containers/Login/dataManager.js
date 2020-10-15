import loginUser from "../../service/authService";

class LoginDataManager {
    
    handleLogin(payload) {
        return loginUser(payload);
    }
}

export default LoginDataManager;