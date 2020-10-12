const UserService = require("../services/userService");
const { succMessage } = require("../utilities/helper");

const userService = new UserService();
module.exports.getAllUsers = async function (req, res) {

    let inputs = req.query;
    let obj = await userService.getAllUsers(inputs);
    if (!obj.status) return res.json(obj);
    let users = obj.data;

    users = users.map(user => {
        return {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
        }
    });
    res.status(200).json(succMessage(true, 200, users, "Users fetched successfully."))
}

module.exports.deleteUser = async function (req, res) {
    
    let inputs = req.params;
    let result = await userService.deleteUser(inputs);
    res.json(result);
    
}