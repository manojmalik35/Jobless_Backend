const User = require("../models/userModel");
const ResetToken = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { KEY, TCOUNT } = require("../configs/config");
const { encrypt, decrypt, Email } = require("../utilities/helper");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const userRouter = require("../routers/userRouter");
const Job = require("../models/jobModel");
const Op = Sequelize.Op;

module.exports.getAllUsers = async function (req, res) {
    try {

        let user = req.user;
        if (user.role != "Admin") {
            return res.status(401).json({
                message: "You are not authorized."
            })
        }

        let role = req.query.role;
        let users;
        if (role == "Candidate") {
            let candidates = await User.findAll({
                where: {
                    role: "Candidate"
                }
            });
            users = candidates;
        } else {
            let recruiters = await User.findAll({
                where: {
                    role: "Recruiter"
                }
            });
            users = recruiters;
        }

        res.status(200).json({
            success: true,
            users: users
        })

    } catch (err) {
        console.log(err);
        res.json({ err });
    }
}



module.exports.updateUser = async function (req, res) {
    try {

        let user_id = req.params.user_id;
        let updateObj = req.body;
        await User.update(updateObj, {
            where: {
                id: user_id
            }
        });

        res.status(204).json({
            success: true
        })
    } catch (err) {
        console.log(err);
        res.json({ err })
    }
}

module.exports.deleteUser = async function (req, res) {
    try {

        let user_id = req.params.user_id;
        await User.destroy({
            where: {
                id: user_id
            }
        });

        res.status(200).json({
            success: true
        })
    } catch (err) {
        console.log(err);
        res.json({ err })
    }
}