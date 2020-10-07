const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { KEY } = require("../configs/config");
const { encrypt, decrypt } = require("../transformers/cryptography");

module.exports.signup = async function (req, res) {
    try {
        await userModel.sync({ alter: true });
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