const { encrypt, decrypt, errMessage, succMessage, Email } = require("../utilities/helper");
const User = require("../models/userModel");
const ResetToken = require("../models/tokenModel");
const crypto = require("crypto");
const { TCOUNT } = require("../configs/config");
const { validateLogin, validateForgotPassword, validateResetPassword } = require("../validators/userValidator");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class authService {

    async login(inputs) {
        let isValid = await validateLogin(inputs);
        if(!isValid.status) return isValid;
        const user = isValid.data;
        let hash = {
            iv: user.hash_iv,
            content: user.password
        }
        const dbPass = decrypt(hash);
        if (dbPass == inputs.password)
            return {status : true, data : user};

        return errMessage(false, 400, "Wrong password");
    }

    async forgotPassword(inputs) {
        let isValid = await validateForgotPassword(inputs);
        if(!isValid.status) return isValid;
        const user = isValid.data;
        let email = user.email;
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

            if (prevToken.count >= TCOUNT) 
                return errMessage(false, 400, `You have already requested token ${TCOUNT} times. Limit exceeded`)

            let updatedAt = prevToken.updatedAt;
            let currTime = new Date();
            let diff = currTime - updatedAt;
            if (diff < 60000) {//within 1 min
                return errMessage(false, 400, "1 min has not been passed since the previous request.");
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
        return succMessage(true, 200, null, "Email has been sent.");
    }

    async resetPassword(inputs) {
        let isValid = await validateResetPassword(inputs);
        if(!isValid.status) return isValid;

        // This code clears all expired tokens. You should move this to a cronjob if you have a big site. We just include this in here as a demonstration.
        await ResetToken.destroy({
            where: {
                expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
            }
        });

        //find the token
        let record = await ResetToken.findOne({
            where: {
                email: inputs.email,
                expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
                token: inputs.token
            }
        });

        if (record == null) {
            return errMessage(false, 400, "Token has expired. Please try password reset again.");
        }

        //update token
        await ResetToken.destroy({
            where: {
                email: record.email
            }
        });

        const hash = encrypt(inputs.password);
        await User.update({
            hash_iv: hash.iv,
            password: hash.content
        }, {
            where: {
                email: record.email
            }
        });

        return succMessage(true, 200, null, "Password has been reset. Please login again.");
    }
}

module.exports = authService;