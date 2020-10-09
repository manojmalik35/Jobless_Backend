const jobRouter = require("express").Router();

const {isLoggedIn} = require("../middlewares/authMiddleware");
const { createNewJob, getJob, getJobs, getPostedJobs, deleteJob } = require("../controllers/jobController");

jobRouter.route("/").post(isLoggedIn, createNewJob);
jobRouter.route("/").get(isLoggedIn, getJobs);
jobRouter.route("/:job_id").get(getJob).delete(isLoggedIn, deleteJob);
jobRouter.route("/recruiter/:recruiter_id").get(isLoggedIn, getPostedJobs);

module.exports = jobRouter;