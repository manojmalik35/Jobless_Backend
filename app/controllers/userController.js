const User = require("../models/userModel");
const ResetToken = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { KEY, TCOUNT } = require("../configs/config");
const { encrypt, decrypt, Email } = require("../utilities/helper");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports.signup = async function (req, res) {
    try {
        // await User.sync();
        let userObj = req.body;
        const hash = encrypt(userObj.password);
        userObj.hash_iv = hash.iv;
        userObj.password = hash.content;
        const user = await User.create(userObj);
        const uuid = user.uuid;
        const token = await jwt.sign({ uuid }, KEY);
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

        // await ResetToken.sync();
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
            
            if(prevToken.count >= TCOUNT){
                return res.json({
                    message : `You have already requested token ${TCOUNT} times. Limit exceeded`
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
        console.log(req.query.token + " " + req.query.email);
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

module.exports.getAllCandidates = async function(req, res){
    try{

        let candidates = await User.findAll({
            where : {
                role : "Candidate"
            }
        });

        res.status(200).json({
            success : true,
            users : candidates
        })

    }catch(err){
        console.log(err);
        res.json({err});
    }
}


module.exports.getAllRecruiters = async function(req, res){
    try{

        let recruiters = await User.findAll({
            where : {
                role : "Recruiter"
            }
        });

        res.status(200).json({
            success : true,
            users : recruiters
        })

    }catch(err){
        console.log(err);
        res.json({err});
    }
}

module.exports.updateUser = async function(req, res){
    try{

        let user_id = req.params.user_id;
        let updateObj = req.body;
        await User.update(updateObj, {
            where : {
                id : user_id
            }
        });

        res.status(204).json({
            success : true
        })
    }catch(err){
        console.log(err);
        res.json({err})
    }
}

module.exports.deleteUser = async function(req, res){
    try{

        let user_id = req.params.user_id;
        await User.destroy({
            where : {
                id : user_id
            }
        });

        res.status(204).json({
            success : true
        })
    }catch(err){
        console.log(err);
        res.json({err})
    }
}