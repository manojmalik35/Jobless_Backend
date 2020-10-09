const { encrypt, decrypt, Email } = require("../utilities/helper");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

class authService{
    async function (inputs) {

        const hash = encrypt(inputs.password);
        inputs.hash_iv = hash.iv;
        inputs.password = hash.content;
        const user = await User.create(inputs);
        const uuid = user.uuid;
        const token = await jwt.sign({ uuid }, KEY);
        user.authToken = token;
    }
}

module.exports = authService;