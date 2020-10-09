const User = require("../models/userModel");
const ResetToken = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { KEY, TCOUNT } = require("../configs/config");
const { encrypt, decrypt, Email } = require("../utilities/helper");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const validate = require("../validators/validator");
const UserService = require("../services/userService");

const userService = new UserService();

module.exports.signup = async function (req, res) {
    // try {

        let inputs = req.body;
        let isValid = validate(inputs);
        if(isValid.status == "error"){
            return res.status(400).json(isValid);
        }

        let user = await userService.create(inputs);
        const uuid = user.uuid;
        const token = jwt.sign({ uuid }, KEY);
        user.authToken = token;
        user.id = undefined;
        res.status(201).json({
            success: true,
            data: user
        })
    // } catch (err) {
    //     res.json()
    // }
}

module.exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
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
            const uuid = user.uuid;
            const token = await jwt.sign({ uuid }, KEY);
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
        let user = await User.findOne({
            where: { email }
        });

        if (user == null) {
            return res.status(200).json({
                status: "ok"
            })
        }

        // Expire any tokens that were previously set for this user. That prevents old tokens from being used.
        let prevToken = await ResetToken.findOne({
            where: { email }
        });

        let token;
        // //token expires after 1 hour
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));//minutes to milliseconds
        if (prevToken == null) {
            token = crypto.randomBytes(32).toString('base64');
            await ResetToken.create({
                email: email,
                expiration: expireDate,
                token: token,
                used: 0,
                count: 1
            });
        } else {

            if (prevToken.count >= TCOUNT) {
                return res.json({
                    message: `You have already requested token ${TCOUNT} times. Limit exceeded`
                })
            }

            let updatedAt = prevToken.updatedAt;
            let currTime = new Date();
            let diff = currTime - updatedAt;
            if (diff < 60000) {//within 1 min
                return res.json({
                    message: "1 min has not been passed since the previous request."
                })
            }

            if (diff < 600000)  // if its within 10 minutes
                token = prevToken.token;
            else//if its after 10 minutes
                token = crypto.randomBytes(32).toString('base64');

            await ResetToken.update({
                token: token,
                expiration: expireDate,
                count: prevToken.count + 1
            }, {
                where: { email }
            })
        }

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
        await ResetToken.destroy({
            where: {
                expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
            }
        });

        //find the token
        let record = await ResetToken.findOne({
            where: {
                email: req.query.email,
                expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
                token: req.query.token
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
        await ResetToken.destroy({
            where: {
                email: record.email
            }
        });

        const hash = encrypt(req.body.password);
        await User.update({
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
        if (req.user != undefined) {
            res.cookie("jwt", "ajfdlafjlaskjfla", {
                httpOnly: true,
                expires: new Date(Date.now())
            });
            // res.redirect("/");
            res.status(200).json({
                message : "You are logged out."
            })
        }
    } catch (err) {
        console.log(err);
        res.json({ err })
    }
}