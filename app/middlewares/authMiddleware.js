const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");
const { errMessage } = require("../utilities/helper");
const { validateToken } = require("../validators/userValidator");
const UserService = require("../services/userService");
const userService = new UserService();

module.exports.isLoggedIn = (role) => {
    return async function (req, res, next) {

        const headers = req.headers;
        if (headers && headers.authorization) {

            const authToken = headers.authorization.split(' ')[1];
            let isValid = await validateToken(authToken);
            if (!isValid.status) return res.status(isValid.code).json(isValid);

            let ans = await jwt.verify(authToken, KEY);
            if (ans) {
                let obj = await userService.getUser(ans);
                if (!obj.status) return res.status(obj.code).json(obj);
                let user = obj.data;
                if (!role.includes(user.role)) {
                    return res.status(403).json(errMessage(false, 403, "You are not authorized."));
                }
                req.user = user;
                next();
            } else
                res.status(401).json(errMessage(false, 401, "Your token is tampered."));

        } else
            res.status(404).json(errMessage(false, 404, "You are not authorized."));
    }
}