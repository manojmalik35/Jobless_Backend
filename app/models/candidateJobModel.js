const db = require("../services/connection");

const candidateJob = db.define('candidateJob', {});

module.exports = candidateJob;

