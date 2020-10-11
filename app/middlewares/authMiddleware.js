const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");
const validate = require("../validators/validator");
const UserService = require("../services/userService");
const userService = new UserService();

module.exports.checkInput = function (req, res, next) {
    if (Object.keys(req.body).length == 0) {
        res.json({
            message: "Please enter data in POST request"
        })
    } else
        next();
}

module.exports.isLoggedIn = (role) => {
    return async function(req, res, next) {
        // try {

        const headers = req.headers;
        if (headers && headers.authorization) {

            const authToken = headers.authorization;
            let inputs = { authToken };
            let isValid = validate(inputs);
            if (isValid.status == "error") {
                return res.status(400).json(isValid);
            }

            let ans = await jwt.verify(authToken, KEY);
            if (ans) {
                const user = await userService.getUser(ans);
                if (!role.includes(user.role)) {
                    res.status(403).json({
                        status: "error",
                        code: 403,
                        message: "You are not authorized."
                    })
                }
                req.user = user;
                next();
            } else {
                res.status(401).json({
                    status: "error",
                    code: 401,
                    message: "Your token is tampered."
                })
            }

        } else {
            res.status(401).json({
                status: "error",
                code: 401,
                message: "You are not logged in."
            })
        }
        // } catch (err) {
        //     console.log(err);
        //     res.json({ err })
        // }
    }
}