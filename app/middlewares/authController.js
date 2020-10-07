const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");



module.exports.isLoggedIn = async function(req, res, next){
    try{

        if(req.cookies && req.cookies.jwt){

            const token = req.cookies.jwt;
            var email = await jwt.verify(token, KEY);
            if(email){
                
            }else{

            }

        }else{
            res.status(401).json({
                message : "Something went wrong!",
                description : "You are not logged in."
            })
        }
    }catch(err){

    }
}