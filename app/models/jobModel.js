const Sequelize = require("sequelize");
const db = require("../services/connection");
const { DataTypes } = Sequelize;

const Job = db.define('Job', {
    id: {
        type: DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4,
        primaryKey : true
    },
    title: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    package: {
        type: DataTypes.INTEGER
    },
    company : {
        type : DataTypes.STRING
    },
    postedBy: {
        type: DataTypes.UUID
    }
});

module.exports = Job;

