const express = require("express");
const applicationRouter = express.Router();

const {isLoggedIn} = require("../middlewares/authMiddleware");
const {createApplication, viewAppliedByCandidates, viewAppliedJobs} = require("../controllers/applicationController");

applicationRouter.route("/").get(isLoggedIn([2]), viewAppliedJobs);
applicationRouter.route("/new").post(isLoggedIn([2]), createApplication);
applicationRouter.route("/:job_id").get(isLoggedIn([1]), viewAppliedByCandidates);
applicationRouter.route("/admin/:candidate_id").get(isLoggedIn([0]), viewAppliedJobs);

module.exports = applicationRouter;

