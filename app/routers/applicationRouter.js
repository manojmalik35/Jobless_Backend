const express = require("express");
const applicationRouter = express.Router();

const {isLoggedIn, checkInput} = require("../middlewares/authController");
const {createApplication, viewAppliedByCandidates, viewAppliedJobs} = require("../controllers/applicationController");

applicationRouter.route("/new").post(checkInput, isLoggedIn, createApplication);
applicationRouter.route("/job/:job_id").get(isLoggedIn, viewAppliedByCandidates);
applicationRouter.route("/candidate/:candidate_id").get(isLoggedIn, viewAppliedJobs);

module.exports = applicationRouter;

