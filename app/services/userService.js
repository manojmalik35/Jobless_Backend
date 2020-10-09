const {encrypt} = require("../utilities/helper");
const User = require("../models/userModel");

class UserService{

    async create(inputs) {
        const hash = encrypt(inputs.password);
        inputs.hash_iv = hash.iv;
        inputs.password = hash.content;
        const user = await User.create(inputs);
        return user;
    }
}


module.exports = UserService;