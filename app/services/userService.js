const { encrypt } = require("../utilities/helper");
const User = require("../models/userModel");

class UserService {

    async create(inputs) {
        const hash = encrypt(inputs.password);
        inputs.hash_iv = hash.iv;
        inputs.password = hash.content;
        const user = await User.create(inputs);
        return user;
    }

    async getUser(inputs) {
        let user;
        if (inputs.email) {
            user = await User.findOne({
                where: { email: inputs.email }
            });
        }

        if (inputs.uuid) {
            user = await User.findOne({
                where: { uuid: inputs.uuid }
            });
        }

        if(inputs.role){
            user = await User.findAll({
                where : {
                    role : inputs.role
                }
            })
        }
        return user;
    }

    async updateUser(inputs){
        let user_id = inputs.id;
        inputs.id = undefined;
        inputs.user_id = undefined;
        await User.update(inputs, {
            where: {
                id: user_id
            }
        });

        return {
            status : "ok",
            code : 200,
            message : "User updated."
        }
    }

    async deleteUser(inputs){
        await User.destroy({
            where: {
                id: inputs.user_id
            }
        });

        return {
            status : "ok",
            code : 204,
            message : "User deleted."
        }
    }
}


module.exports = UserService;