const validator = require("validator");
const { errMessage } = require("../utilities/helper");
const User = require("../models/userModel");
const { decrypt } = require("../utilities/helper");

async function validateSignup(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.email)
        errors.email = "Email is required.";
    else if (!validator.isEmail(inputs.email)) {
        errors.email = "Email is not valid.";
        status = 422;
    }

    if (!inputs.password)
        errors.password = "Password is required.";
    else if (!validator.isLength(inputs.password, { min: 6, max: 100 })) {
        errors.password = "Password must be at least 6 characters.";
        status = 422;
    }

    if (!inputs.confirmPassword)
        errors.confirmPassword = "Confirm Password is required.";
    else if (!validator.equals(inputs.confirmPassword, inputs.password)) {
        errors.confirmPassword = "Password does not match with confirmPassword.";
        status = 422;
    }

    if (!inputs.name)
        errors.name = "Name is required.";
    else if (!validator.isAlpha(validator.blacklist(inputs.name, ' '))) {
        errors.name = "Name cannot contain any numbers or special characters.";
        status = 422;
    }

    if (!inputs.role)
        errors.role = "Role is required. Please enter 1 or 2.(1 for recruiter and 2 for candidate)";
    else if (typeof inputs.role == String) {
        if (!validator.isIn(inputs.role, ["1", "2"]))
            errors.role = "Role is not valid. Please enter 1 or 2.(1 for recruiter and 2 for candidate)";
        status = 422;
    } else if (typeof inputs.role == Number) {
        if (!validator.isIn(inputs.role, [1, 2]))
            errors.role = "Role is not valid. Please enter 1 or 2.(1 for recruiter and 2 for candidate)";
        status = 422;
    }

    if (inputs.phone) {
        if (!validator.isMobilePhone(inputs.phone)) {
            errors.phone = "Phone no. is not valid.";
            status = 422;
        }

        if (!validator.isLength(inputs.phone, { min: 10, max: 10 })) {
            errors.phone = "Phone no. must contain 10 digits.";
            status = 422;
        }
    }
    if (inputs.phone.length == 0) {
        delete inputs.phone;
    }
    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);

    const user = await User.findOne({
        where: { email: inputs.email }
    });
    if (user)
        return errMessage(false, 422, "Email already exists.");

    return {
        status: true
    }
}

async function validateLogin(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.email)
        errors.email = "Email is required.";
    else if (!validator.isEmail(inputs.email)) {
        errors.email = "Email is not valid.";
        status = 422;
    }

    if (!inputs.password)
        errors.password = "Password is required.";
    else if (!validator.isLength(inputs.password, { min: 6, max: 100 })) {
        errors.password = "Password must be at least 6 characters.";
        status = 422;
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);
    const user = await User.findOne({
        where: { email: inputs.email }
    });

    if (user == null)
        return errMessage(false, 401, "Email does not exist.");

    return {
        status: true,
        data: user
    }
}

async function validateForgotPassword(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.email)
        errors.email = "Email is required.";
    else if (!validator.isEmail(inputs.email)) {
        errors.email = "Email is not valid.";
        status = 422;
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);

    const user = await User.findOne({
        where: { email: inputs.email }
    });

    if (user == null) {
        return errMessage(false, 401, "Email does not exist.");
    }

    return {
        status: true,
        data: user
    }
}

async function validateResetPassword(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.email)
        errors.email = "Email is required.";
    else if (!validator.isEmail(inputs.email)) {
        errors.email = "Email is not valid.";
        status = 422;
    }

    if (!inputs.password)
        errors.password = "Password is required.";
    else if (!validator.isLength(inputs.password, { min: 6, max: 100 })) {
        errors.password = "Password must be at least 6 characters.";
        status = 422;
    }

    if (!inputs.confirmPassword)
        errors.confirmPassword = "confirmPassword is required.";
    else if (!validator.equals(inputs.confirmPassword, inputs.password)) {
        errors.confirmPassword = "Password does not match with confirmPassword.";
        status = 422;
    }

    if (!inputs.token)
        errors.token = "Token is required.";
    else if (!validator.isBase64(inputs.token)) {
        errors.token = "Token is not valid.";
        status = 422;
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);
    const user = await User.findOne({
        where: { email: inputs.email }
    });

    if (user == null) {
        return errMessage(false, 401, "Email does not exist.");
    }

    let hash = {
        iv: user.hash_iv,
        content: user.password
    }
    const dbPass = decrypt(hash);
    if (dbPass == inputs.password)
        return errMessage(false, 400, "New Password cannot be same as old password.");
    return {
        status: true
    }
}

async function validateGetAllUsers(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.role)
        errors.role = "Role is required. Please enter 1 or 2.(1 for recruiter and 2 for candidate)";
    else if (!validator.isIn(inputs.role + "", ["1", "2"])) {
        errors.role = "Role is not valid. Please enter 1 or 2.";
        status = 422;
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);

    return {
        status: true
    }
}

async function validateGetUser(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.uuid)
        errors.uuid = "User id is required.";
    else if (!validator.isUUID(inputs.uuid)) {
        errors.uuid = "User id is not valid.";
        status = 422;
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);

    return {
        status: true
    }
}

async function validateDeleteUser(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.user_id)
        errors.user_id = "User id is required.";
    else if (!validator.isUUID(inputs.user_id)) {
        errors.user_id = "User id is not valid.";
        status = 422;
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);

    let user = await User.findOne({
        where: { uuid: inputs.user_id }
    });
    if (!user)
        return errMessage(false, 400, "Email does not exist.");

    return {
        status: true,
        data: user
    }
}

async function validateToken(token) {
    if (!validator.isJWT(token))
        return errMessage(false, 422, { token: "Your token is not valid." });

    return {
        status: true
    }
}

async function isUserPresent(inputs) {
    let user;
    if (inputs.email) {
        user = await User.findOne({
            where: { email: inputs.email }
        });
    }

    if (inputs.user_id) {
        user = await User.findOne({
            where: {
                uuid: inputs.user_id
            }
        });
    }

    return user;
}

module.exports = { validateSignup, validateLogin, validateForgotPassword, validateResetPassword, validateGetAllUsers, validateDeleteUser, validateToken, validateGetUser, isUserPresent };