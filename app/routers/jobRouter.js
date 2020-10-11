const jobRouter = require("express").Router();

const {isLoggedIn} = require("../middlewares/authMiddleware");
const { createNewJob, getJob, getJobs, getPostedJobs, deleteJob } = require("../controllers/jobController");

jobRouter.route("/").post(isLoggedIn([1]), createNewJob);
jobRouter.route("/").get(isLoggedIn([0, 2]), getJobs);
jobRouter.route("/:job_id").get(isLoggedIn([0, 2]), getJob).delete(isLoggedIn([0, 1]), deleteJob);
jobRouter.route("/recruiter/:recruiter_id").get(isLoggedIn([0, 1]), getPostedJobs);

module.exports = jobRouter;