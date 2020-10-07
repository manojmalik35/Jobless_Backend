const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");
const { encrypt, decrypt, Email } = require("../utilities/helper");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports.signup = async function (req, res) {
    try {
        await userModel.sync();
        let userObj = req.body;
        const hash = encrypt(userObj.password);
        userObj.hash_iv = hash.iv;
        userObj.password = hash.content;
        const user = await userModel.create(userObj);
        const id = user.id;
        const token = await jwt.sign({ id }, KEY);
        res.cookie("jwt", token, { httpOnly: true });
        res.status(201).json({
            success: true,
            data: user
        })
    } catch (err) {
        res.json({
            err
        })
    }
}

module.exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({
            where: {
                email
            }
        });

        let hash = {
            iv: user.hash_iv,
            content: user.password
        }
        const dbPass = decrypt(hash);

        if (dbPass == password) {
            const id = user.id;
            const token = await jwt.sign({ id }, KEY);
            res.cookie("jwt", token, { httpOnly: true });
            res.status(200).json({
                success: true,
                data: user
            })
        } else {
            res.status(401).json({
                message: "Something went wrong!",
                description: "Wrong password."
            })
        }
    } catch (err) {
        res.json({ err })
    }
}

module.exports.forgotPassword = async function (req, res) {
    try {

        const { email } = req.body;
        let user = await userModel.findOne({
            where: { email }
        });

        if (user == null) {
            return res.status(200).json({
                status: "ok"
            })
        }

        await tokenModel.sync();
        // Expire any tokens that were previously set for this user. That prevents old tokens from being used.
        await tokenModel.update({
            used: 1
        }, {
            where: { email }
        });

        var token = crypto.randomBytes(32).toString('hex');

        //token expires after 1 hour
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));//minutes to milliseconds
        await tokenModel.create({
            email: email,
            expiration: expireDate,
            token: token,
            used: 0
        });

        // create email
        const message = {
            to: email,
            subject: "Reset Password",
            text: token,
            html: `<b> To reset your password, click the link below </b> https://localhost:3000/api/v1/users/reset-password?token=${encodeURIComponent(token)}&email=${email}`
        };

        Email(message);
        res.status(200).json({
            data: "Email has been sent."
        })

    } catch (err) {
        console.log(err);
        res.json({ err });
    }
}

module.exports.resetPassword = async function (req, res) {
    try {

        // This code clears all expired tokens. You should move this to a cronjob if you have a big site. We just include this in here as a demonstration.
        await tokenModel.destroy({
            where: {
                expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
            }
        });

        //find the token
        console.log(req.query.token + " " + req.query.email);
        let record = await tokenModel.findOne({
            where: {
                email: req.query.email,
                expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
                token: req.query.token,
                used: 0
            }
        });

        if (record == null) {
            return res.json({
                message: 'Token has expired. Please try password reset again.'
            })
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Passwords do not match. Please try again.'
            });
        }

        //validate Password

        //update token
        await tokenModel.update({
            used: 1
        }, {
            where: {
                email: record.email
            }
        });

        const hash = encrypt(req.body.password);
        await userModel.update({
            hash_iv: hash.iv,
            password: hash.content
        }, {
            where: {
                email: record.email
            }
        });

        return res.status(200).json({
            message: "Password has been reset. Please login again."
        })
    } catch (err) {
        console.log(err);
        res.json({ err });
    }
}

module.exports.logout = async function (req, res) {
    try {
        res.cookie("jwt", "ajfdlafjlaskjfla", {
            httpOnly: true,
            expires: new Date(Date.now())
        });
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.json({ err })
    }
}