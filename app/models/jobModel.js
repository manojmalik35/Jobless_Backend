const Sequelize = require("sequelize");
const db = require("../configs/connection");
const { DataTypes } = Sequelize;

const Job = db.define('Job', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    title: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    package: {
        type: DataTypes.STRING
    },
    company : {
        type : DataTypes.STRING
    }
});

module.exports = Job;

