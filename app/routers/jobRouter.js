const jobRouter = require("express").Router();

const { createNewJob } = require("../controllers/jobController");

jobRouter.route("/").post(createNewJob);

module.exports = jobRouter;