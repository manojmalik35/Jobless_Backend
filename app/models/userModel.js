const Sequelize = require("sequelize");
const db = require("../configs/connection");
const { DataTypes } = Sequelize;

const User = db.define('User', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    hash_iv : DataTypes.STRING,
    password: {
        type: DataTypes.STRING
    },
    phone : {
        type : DataTypes.BIGINT(10)
    },
    role: {
        type: DataTypes.INTEGER// 0 = admin, 1=recruiter , 2=candidate
    }
});

module.exports = User;

