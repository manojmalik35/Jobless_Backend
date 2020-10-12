const UserService = require("../services/userService");
const {isDuplicate} = require("../validators/duplicateFinder");
const validate = require("../validators/validator");

const userService = new UserService();
module.exports.getAllUsers = async function (req, res) {
    // try {

        let inputs = req.query;
        let isValid = validate(inputs);
        if(isValid.status == "error"){
            return res.status(400).json(isValid);
        }

        let users = await userService.getUser(inputs);
        for(let i = 0; i < users.length; i++){
            users[i].dataValues.id = undefined;
        }

        res.status(200).json({
            status : "ok",
            data : users
        })

    // } catch (err) {
    //     console.log(err);
    //     res.json({ err });
    // }
}



module.exports.updateUser = async function (req, res) {
    // try {

        let user_id = req.params.user_id;
        let inputs = req.body;
        inputs.id = user_id;
        let isValid = validate(inputs);
        if(isValid.status == "error"){
            return res.status(400).json(isValid);
        }
        
        inputs.user_id = inputs.id;
        let isPresent = await isDuplicate(inputs);
        if(!isPresent)
            return res.status(400).json(errMessage("error", 400, "id", "User not found"))

        let result = await userService.updateUser(updateObj);
        res.status(200).json(result);
    // } catch (err) {
    //     console.log(err);
    //     res.json({ err })
    // }
}

module.exports.deleteUser = async function (req, res) {
    // try {

        let user_id = req.params.user_id;
        let inputs = { id : user_id}
        let isValid = validate(inputs);
        if(isValid.status == "error"){
            return res.status(400).json(isValid);
        }

        inputs = {user_id};
        let isPresent = await isDuplicate(inputs);
        if(!isPresent)
            return res.status(400).json(errMessage("error", 400, "email", "User not found"))

        let result = await userService.deleteUser(inputs);
        res.status(200).json(result);
    // } catch (err) {
    //     console.log(err);
    //     res.json({ err })
    // }
}