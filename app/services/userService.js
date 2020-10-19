const { encrypt, succMessage, errMessage } = require("../utilities/helper");
const User = require("../models/userModel");
const userValidator = require("../validators/userValidator");

class UserService {

    async create(inputs) {
        let isValid = await userValidator.validateSignup(inputs);
        if (!isValid.status) return isValid;
        const hash = encrypt(inputs.password);
        inputs.hash_iv = hash.iv;
        inputs.password = hash.content;
        const user = await User.create(inputs);
        return { status: true, data: user };
    }

    async getAllUsers(inputs) {
        let isValid = await userValidator.validateGetAllUsers(inputs);
        if (!isValid.status) return isValid;

        let users = await User.findAll({
            where: { role: inputs.role },
            order : [
                ["updatedAt", "DESC"]
            ],
            limit: process.env.PAGINATION_LIMIT,
            offset: inputs.page && inputs.page > 0 ? (inputs.page - 1) * process.env.PAGINATION_LIMIT : 0
        });

        let count = await User.count({
            where: { role: inputs.role },
        });

        return { status: true, data: users, count };
    }

    async getUser(inputs) {

        let isValid = await userValidator.validateGetUser(inputs);
        if (!isValid.status) return isValid;

        let user = await User.findOne({
            where: { uuid: inputs.uuid }
        });

        if(user)
            return {status : true, data : user};
        
        return errMessage(false, 400, "User not found.");
    }

    async deleteUser(inputs) {
        let isValid = await userValidator.validateDeleteUser(inputs);
        if (!isValid.status) return isValid;
        let user = isValid.data;
        await User.destroy({
            where: {
                id: user.id
            }
        });

        return succMessage(true, 204, null, "User deleted.");
    }
}


module.exports = UserService;