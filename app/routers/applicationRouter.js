const express = require("express");
const applicationRouter = express.Router();

const {isLoggedIn, checkInput} = require("../middlewares/authController");
const {createApplication} = require("../controllers/applicationController");

applicationRouter.route("/new").post(checkInput, isLoggedIn, createApplication);
// applicationRouter.route("/:job_id").get(isLoggedIn, viewAppliedByCandidates);

module.exports = applicationRouter;

