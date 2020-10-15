const UserService = require("../services/userService");

const userService = new UserService();
module.exports.getAllUsers = async function (req, res) {

    let inputs = req.query;
    let obj = await userService.getAllUsers(inputs);
    if (!obj.status) return res.status(obj.code).json(obj);
    let users = obj.data;
    let count = obj.count;

    users = users.map(user => {
        return {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
        }
    });
    res.status(200).json({
        status : true,
        code : 200,
        data : users,
        message : "Users successfully fetched.",
        metadata : {
            resultset : {
                limit : 20,
                count : count
            }
        }
    });
}

module.exports.deleteUser = async function (req, res) {
    
    let inputs = req.params;
    let result = await userService.deleteUser(inputs);
    res.status(result.code).json(result);
    
}