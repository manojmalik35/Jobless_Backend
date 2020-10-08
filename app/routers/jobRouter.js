const jobRouter = require("express").Router();

const {isLoggedIn} = require("../middlewares/authController");
const { createNewJob, getJobs } = require("../controllers/jobController");

jobRouter.route("/").post(isLoggedIn, createNewJob);
jobRouter.route("/").get(isLoggedIn, getJobs);

module.exports = jobRouter;