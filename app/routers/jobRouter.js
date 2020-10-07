const jobRouter = require("express").Router();

const {isLoggedIn} = require("../middlewares/authController");
const { createNewJob, getAllJobs } = require("../controllers/jobController");

jobRouter.route("/").post(isLoggedIn, createNewJob).get(isLoggedIn, getAllJobs);

module.exports = jobRouter;