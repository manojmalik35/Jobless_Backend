const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");

module.exports.checkInput = function (req, res, next) {
    if (Object.keys(req.body).length == 0) {
        res.json({
            message: "Please enter data in POST request"
        })
    } else
        next();
}

module.exports.isLoggedIn = (role) => {
    async (req, res, next) => {
        try {

            const headers = req.headers;
            if (headers && headers.Authorization) {

                const token = headers.Authorization;
                let ans = await jwt.verify(token, KEY);
                if (ans) {
                    const user = await userModel.findOne({ where: { uuid: ans.uuid } });

                    if(!role.includes(user.role)){
                        res.status(403).json({
                            
                        })
                    }
                    req.user = user;
                    next();
                } else {
                    res.status(401).json({
                        message: "Your token is tampered."
                    })
                }

            } else {
                res.status(401).json({
                    message: "Something went wrong!",
                    description: "You are not logged in."
                })
            }
        } catch (err) {
            console.log(err);
            res.json({ err })
        }
    }
}