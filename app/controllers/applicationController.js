const isDuplicate = require("../validators/duplicateFinder");
const validate = require("../validators/validator");
const ApplicationService = require("../services/applicationService");

const applicationService = new ApplicationService();

module.exports.createApplication = async function (req, res) {
    // try {

        let candidate = req.user;
        let inputs = req.body;
        inputs.id = inputs.job_id;
        let isValid = validate(inputs);
        if (isValid.status == "error") {
            return res.status(400).json(isValid);
        }

        let isPresent = await isDuplicate(inputs);
        if (!isPresent)
            return res.status(400).json(errMessage("error", 400, "id", "Job not found"))

        inputs.candidate = candidate;
        let application = await applicationService.create(inputs);
        application.dataValues.id = undefined;

        res.status(201).json({
            status: "ok",
            data: application
        });

    // } catch (err) {
    //     console.log(err);
    //     res.json({ err })
    // }
}

module.exports.viewAppliedByCandidates = async function (req, res) {
    let user = req.user;
    let job_id = req.params.job_id;
    let inputs = {id : job_id};
    let isValid = validate(inputs);
    if (isValid.status == "error") {
        return res.status(400).json(isValid);
    }

    inputs.job_id = job_id;
    let isPresent = await isDuplicate(inputs);
    if (!isPresent)
        return res.status(400).json(errMessage("error", 400, "id", "Job not found"));

    let applyingUsers = await applicationService.getAppliedByCandidates(inputs);
    for(let i = 0; i < applyingUsers.length; i++){
        applyingUsers[i].id = undefined;
        applyingUsers[i].Jobs = undefined;
    }

    res.status(200).json({
        status : "ok",
        users: applyingUsers
    })
}

module.exports.viewAppliedJobs = async function (req, res) {
    let candidate_id = req.params.candidate_id;
    let inputs = { id: candidate_id };
    let isValid = validate(inputs);
    if (isValid.status == "error") {
        return res.status(400).json(isValid);
    }

    inputs.user_id = candidate_id;
    let isPresent = await isDuplicate(inputs);
    if (!isPresent)
        return res.status(400).json(errMessage("error", 400, "id", "Candidate not found"));

    let appliedJobs = await applicationService.getAppliedJobs(inputs);
    for(let i = 0; i < appliedJobs.length; i++){
        appliedJobs[i].id = undefined;
        appliedJobs[i].Users = undefined;
    }
    res.status(200).json({
        status : "ok",
        jobs: appliedJobs
    })
}

