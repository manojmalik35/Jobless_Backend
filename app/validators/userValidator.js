const validator = require("validator");
const { errMessage } = require("../utilities/helper");
const User = require("../models/userModel");

async function validateSignup(inputs) {
    if (!inputs.email)
        return errMessage(false, 400, "Email is required.");
    if (!inputs.password)
        return errMessage(false, 400, "Password is required.");
    if (!inputs.name)
        return errMessage(false, 400, "Name is required.");
    if (!inputs.role)
        return errMessage(false, 400, "Role is required. Please enter 1 or 2.(1 for recruiter and 2 for candidate)");

    if (!validator.isEmail(inputs.email))
        return errMessage(false, 400, "Email is not valid.");
    if (!validator.isLength(inputs.password, { min: 8, max: 100 }))
        return errMessage(false, 400, "Password must be at least 8 characters.");
    if (!validator.isAlpha(inputs.name))
        return errMessage(false, 400, "Name cannot contain any numbers or special characters.");
    if (!validator.isIn(inputs.role, ["1", "2"]))
        return errMessage(false, 400, "Role is not valid. Please enter 1 or 2.(1 for recruiter and 2 for candidate)");
    if (inputs.phone) {
        if (!validator.isMobilePhone(inputs.phone))
            return errMessage(false, 400, "Phone no. is not valid.");

        if (!validator.isLength(inputs.phone, { min: 7, max: 10 }))
            return errMessage(false, 400, "Phone no. must contain at least 7 digits and at most 10 digits.");
    }

    const user = await isUserPresent(inputs);
    if (user)
        return errMessage(false, 400, "User already exists.");

    return {
        status: true
    }
}

async function validateLogin(inputs) {
    if (!inputs.email)
        return errMessage(false, 400, "Email is required.");
    if (!inputs.password)
        return errMessage(false, 400, "Password is required.");

    if (!validator.isEmail(inputs.email))
        return errMessage(false, 400, "Email is not valid.");
    if (!validator.isLength(inputs.password, { min: 8, max: 100 }))
        return errMessage(false, 400, "Password must be at least 8 characters.");

    const user = await isUserPresent(inputs);

    if (user == null) {
        return errMessage(false, 400, "User does not exist.");
    }

    return {
        status: true,
        data: user
    }
}

async function validateForgotPassword(inputs) {
    if (!inputs.email)
        return errMessage(false, 400, "Email is required.");

    if (!validator.isEmail(inputs.email))
        return errMessage(false, 400, "Email is not valid.");

    const user = await isUserPresent(inputs);

    if (user == null) {
        return errMessage(false, 400, "User does not exist.");
    }

    return {
        status: true,
        data: user
    }
}

async function validateResetPassword(inputs) {
    if (!inputs.email)
        return errMessage(false, 400, "Email is required.");
    if (!inputs.password)
        return errMessage(false, 400, "Password is required.");
    if (!inputs.confirmPassword)
        return errMessage(false, 400, "confirmPassword is required.");
    if (!inputs.token)
        return errMessage(false, 400, "Token is required.");


    if (!validator.isEmail(inputs.email))
        return errMessage(false, 400, "Email is not valid.");
    if (!validator.isLength(inputs.password, { min: 8, max: 100 }))
        return errMessage(false, 400, "Password must be at least 8 characters.");
    if (!validator.equals(inputs.confirmPassword, inputs.password))
        return errMessage(false, 400, "Password does not match with confirmPassword.");
    if (!validator.isBase64(inputs.token))
        return errMessage(false, 400, "Token is not valid.");

    const user = await isUserPresent(inputs);

    if (user == null) {
        return errMessage(false, 400, "User does not exist.");
    }
    return {
        status: true
    }
}

async function validateGetAllUsers(inputs) {
    if (!inputs.role)
        return errMessage(false, 400, "Role is required. Please enter 1 or 2.");

    if (!validator.isIn(inputs.role + "", ["1", "2"]))
        return errMessage(false, 400, "Role is not valid. Please enter 1 or 2.");

    return {
        status: true
    }
}

async function validateGetUser(inputs) {
    if (!inputs.uuid)
        return errMessage(false, 400, "User id is required.");

    if (!validator.isUUID(inputs.uuid))
        return errMessage(false, 400, "User id is not valid.");

    return {
        status: true
    }
}

async function validateDeleteUser(inputs) {
    if (!inputs.user_id)
        return errMessage(false, 400, "User id is required.");

    if (!validator.isUUID(inputs.user_id))
        return errMessage(false, 400, "User id is not valid.");

    let user = await isUserPresent(inputs);
    if (!user)
        return errMessage(false, 400, "User does not exist.");

    return {
        status: true,
        data: user
    }
}

async function validateToken(token) {
    if (!validator.isJWT(token))
        return errMessage(false, 400, "Your token is not valid.");

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