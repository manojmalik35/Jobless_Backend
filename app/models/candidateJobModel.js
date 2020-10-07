const Sequelize = require("sequelize");
const db = require("../services/connection");
const { DataTypes } = Sequelize;

const candidateJob = db.define('candidate_job', {
    user_id : DataTypes.UUID,
    job_id : DataTypes.UUID
});

module.exports = candidateJob;

