const express = require("express");
const applicationRouter = express.Router();

const {isLoggedIn, checkInput} = require("../middlewares/authMiddleware");
const {createApplication, viewAppliedByCandidates, viewAppliedJobs} = require("../controllers/applicationController");

applicationRouter.route("/new").post(checkInput, isLoggedIn([2]), createApplication);
applicationRouter.route("/job/:job_id").get(isLoggedIn([0, 1]), viewAppliedByCandidates);
applicationRouter.route("/candidate/:candidate_id").get(isLoggedIn([0, 2]), viewAppliedJobs);

module.exports = applicationRouter;

