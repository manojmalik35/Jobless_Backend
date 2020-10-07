const Sequelize = require("sequelize");
const db = require("../services/connection");
const { DataTypes } = Sequelize;

const User = db.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        primaryKey : true
    },
    hash_iv : DataTypes.STRING,
    password: {
        type: DataTypes.STRING
    },
    phone : {
        type : DataTypes.BIGINT(10)
    },
    role: {
        type: DataTypes.STRING
    },
    token : DataTypes.STRING
});

module.exports = User;

