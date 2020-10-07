const { DATE } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../services/connection");
const { DataTypes } = Sequelize;

const ResetToken = db.define('ResetToken', {
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    expiration: DataTypes.DATE,
    used: DataTypes.INTEGER
});

module.exports = ResetToken;

