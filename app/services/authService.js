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
        if (!isValid.status) return isValid;
        const user = isValid.data;
        if (user.role == 0)
            return errMessage(false, 400, "You cannot login from here.");
        let hash = {
            iv: user.hash_iv,
            content: user.password
        }
        const dbPass = decrypt(hash);
        if (dbPass == inputs.password)
            return { status: true, data: user };

        return errMessage(false, 400, "Wrong password");
    }

    async adminLogin(inputs) {
        let isValid = await validateLogin(inputs);
        if (!isValid.status) return isValid;
        const user = isValid.data;
        if (user.role != 0)
            return errMessage(false, 400, "You cannot login from here.");
        let hash = {
            iv: user.hash_iv,
            content: user.password
        }
        const dbPass = decrypt(hash);
        if (dbPass == inputs.password)
            return { status: true, data: user };

        return errMessage(false, 400, "Wrong password");
    }

    async forgotPassword(inputs) {
        let isValid = await validateForgotPassword(inputs);
        if (!isValid.status) return isValid;
        const user = isValid.data;
        let email = user.email;

        let prevToken = await ResetToken.findOne({
            where: { email }
        });

        let token;

        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));
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
            if (diff < 60000) {
                return errMessage(false, 400, "1 min has not been passed since the previous request.");
            }

            if (diff < 600000)
                token = prevToken.token;
            else
                token = crypto.randomBytes(32).toString('base64');

            await ResetToken.update({
                token: token,
                expiration: expireDate,
                count: prevToken.count + 1
            }, {
                where: { email }
            })
        }


        const message = {
            to: email,
            subject: "Reset Password",
            text: token,
            html: `<b> To reset your password, click the following link</b>\n 
            ${process.env.DEPLOYED_URL}/api/v1/users/reset-password?token=${encodeURIComponent(token)}&email=${email}"`
        };

        Email(message);
        return succMessage(true, 200, null, "Email has been sent.");
    }

    async resetPassword(inputs) {
        let isValid = await validateResetPassword(inputs);
        if (!isValid.status) return isValid;


        await ResetToken.destroy({
            where: {
                expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
            }
        });


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