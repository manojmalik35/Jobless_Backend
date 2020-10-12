const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");
const { errMessage } = require("../utilities/helper");
const { validateToken } = require("../validators/userValidator");
const UserService = require("../services/userService");
const userService = new UserService();

module.exports.checkInput = function (req, res, next) {
    if (Object.keys(req.body).length == 0) {
        res.json(errMessage(false, 400, "Please enter data in POST request"));
    } else
        next();
}

module.exports.isLoggedIn = (role) => {
    return async function (req, res, next) {

        const headers = req.headers;
        if (headers && headers.authorization) {

            const authToken = headers.authorization;
            let isValid = await validateToken(authToken);
            if (!isValid.status) return res.json(isValid);

            let ans = await jwt.verify(authToken, KEY);
            if (ans) {
                let obj = await userService.getUser(ans);
                if (!obj.status) return res.json(obj);
                let user = obj.data;
                if (!role.includes(user.role)) {
                    return res.status(403).json(errMessage(false, 403, "You are not authorized."));
                }
                req.user = user;
                next();
            } else
                res.status(401).json(errMessage(false, 401, "Your token is tampered."));

        } else
            res.status(401).json(errMessage(false, 401, "You are not logged in."));
    }
}