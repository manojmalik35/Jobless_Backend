const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");
const { errMessage, succMessage } = require("../utilities/helper");
const AuthService = require("../services/authService");
const recaptchaHelpers = require("../utilities/recaptcha");

const authService = new AuthService();

module.exports.signup = async function (req, res) {

    let inputs = req.body;
    let obj = await authService.signup(inputs);
    if (!obj.status) return res.status(obj.code).json(obj);

    const user = obj.data;
    const uuid = user.uuid;
    const token = jwt.sign({ uuid }, KEY);
    res.status(201).json(succMessage(true, 201, {
        email: user.email,
        authToken: token,
        uuid: uuid,
        role: user.role,
        time: user.createdAt
    }, "You have successfully signed up."));
}

module.exports.login = async function (req, res) {

    const inputs = req.body;
    let obj = await authService.login(inputs);
    if (!obj.status) return res.status(obj.code).json(obj);
    let user = obj.data;
    const uuid = user.uuid;
    const token = await jwt.sign({ uuid }, KEY);
    res.status(200).json(succMessage(true, 200, {
        email: user.email,
        authToken: token,
        uuid: uuid,
        role: user.role
    }, "User logged in."))
}

module.exports.adminLogin = async function (req, res) {

    const recaptchaData = {
        remoteip: req.connection.remoteAddress,
        response: req.body.recaptchaResponse,
        secret: process.env.RECAPTCHA_SECRET_KEY,
    };

    return recaptchaHelpers.verifyRecaptcha(recaptchaData)
        .then(async function() {
            // Process the request
            const inputs = req.body;
            let obj = await authService.adminLogin(inputs);
            if (!obj.status) return res.status(obj.code).json(obj);
            let user = obj.data;
            const uuid = user.uuid;
            const token = await jwt.sign({ uuid }, KEY);
            res.status(200).json(succMessage(true, 200, {
                email: user.email,
                authToken: token,
                uuid: uuid,
                role: user.role
            }, "User logged in."))
        }).catch(err=>{
            res.status(400).json(errMessage(false, 400, "Captcha is not valid."));
        })

}

module.exports.forgotPassword = async function (req, res) {

    const inputs = req.body;
    let result = await authService.forgotPassword(inputs);
    res.status(result.code).json(result);
}

module.exports.resetPassword = async function (req, res) {

    const inputs = req.body;
    let result = await authService.resetPassword(inputs);
    res.status(result.code).json(result);


}
