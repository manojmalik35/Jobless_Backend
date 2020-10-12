const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");
const validate = require("../validators/validator");
const {isDuplicate} = require("../validators/duplicateFinder");
const {errMessage} = require("../utilities/helper");
const UserService = require("../services/userService");
const AuthService = require("../services/authService");

const userService = new UserService();
const authService = new AuthService();

module.exports.signup = async function (req, res) {
    // try {

        let inputs = req.body;
        let isValid = validate(inputs);
        if(isValid.status == "error"){
            return res.status(400).json(isValid);
        }

        let isPresent = await isDuplicate(inputs);
        if(isPresent)
            return res.status(400).json(errMessage("error", 121, "email", "Email already exists."));

        let user = await userService.create(inputs);
        const uuid = user.uuid;
        const token = jwt.sign({ uuid }, KEY);
        user.dataValues.authToken = token;
        user.dataValues.id = undefined;
        res.status(201).json({
            status : "ok",
            data: user
        })
    // } catch (err) {
    //     res.json()
    // }
}

module.exports.login = async function (req, res) {
    // try {
        const inputs = req.body;
        let isValid = validate(inputs);
        if(isValid.status == "error"){
            return res.status(400).json(isValid);
        }

        let isPresent = await isDuplicate(inputs);
        if(!isPresent)
            return res.status(401).json(errMessage("error", 401, "email", "User not found"))

        let user = await authService.login(inputs);
        if (user) {
            const uuid = user.uuid;
            const token = await jwt.sign({ uuid }, KEY);
            user.dataValues.authToken = token;
            user.dataValues.id = undefined;
            res.status(200).json({
                status : "ok",
                success: true,
                data: user
            })
        } else {
            res.status(401).json(errMessage("error", 401, "password", "Wrong password."));
        }
    // } catch (err) {
    //     res.json({ err })
    // }
}

module.exports.forgotPassword = async function (req, res) {
    // try {

        const inputs = req.body;
        let isValid = validate(inputs);
        if(isValid.status == "error"){
            return res.status(400).json(isValid);
        }

        let isPresent = await isDuplicate(inputs);
        if(!isPresent)
            return res.status(401).json(errMessage("error", 401, "email", "User not found"))

        let result = await authService.forgotPassword(inputs);
        if(result.status == "error")
            res.status(400).json(result);
        else
            res.status(200).json(result);

    // } catch (err) {
    //     console.log(err);
    //     res.json({ err });
    // }
}

module.exports.resetPassword = async function (req, res) {
    // try {

        const inputs = req.body;
        inputs.resetToken = inputs.token;
        inputs.token = undefined;
        let isValid = validate(inputs);
        if(isValid.status == "error"){
            return res.status(400).json(isValid);
        }

        let result = await authService.resetPassword(inputs);
        if(result.status == "error")
            res.status(400).json(result);
        else
            res.status(200).json(result);
        
    // } catch (err) {
    //     console.log(err);
    //     res.json({ err });
    // }
}
