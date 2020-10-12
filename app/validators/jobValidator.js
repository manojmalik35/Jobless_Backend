const validator = require("validator");
const { errMessage } = require("../utilities/helper");
const Job = require("../models/jobModel");

async function validateNewJob(inputs) {
    if (!inputs.title)
        return errMessage(false, 400, "Title is required.");
    if (!inputs.description)
        return errMessage(false, 400, "Description is required.");
    if (!inputs.company)
        return errMessage(false, 400, "Company is required.");

    if (!validator.isLength(inputs.title, { min: 5, max: 100 }))
        return errMessage(false, 400, "Please enter valid job title.");
    if (!validator.isLength(inputs.description, { min: 10, max: 1000 }))
        return errMessage(false, 400, "Please enter a description of at least 10 characters.");
    if (!validator.isLength(inputs.company, { min: 5, max: 1000 }))
        return errMessage(false, 400, "Please enter a valid company name");
    if (inputs.package) {
        if (!validator.isNumeric(inputs.package))
            return errMessage(false, 400, "Please enter a valid package.");
    }

    const job = await isJobPresent(inputs);
    if (job)
        return errMessage(false, 400, "Job already exists.");

    return {
        status: true
    }
}

async function validateGetJob(inputs) {
    if (!inputs.job_id)
        return errMessage(false, 400, "Job id is required.");

    if (!validator.isUUID(inputs.job_id))
        return errMessage(false, 400, "Job id is not valid.");

    let job = await isJobPresent(inputs);
    if (!job) return errMessage(false, 400, "Job does not exist.");
    return {
        status: true,
        data: job
    }
}

async function validateDeleteJob(inputs) {
    if (!inputs.job_id)
        return errMessage(false, 400, "Job id is required.");

    if (!validator.isUUID(inputs.job_id))
        return errMessage(false, 400, "Job id is not valid.");

    let job = await isJobPresent(inputs);
    if (!job)
        return errMessage(false, 400, "Job does not exist.");

    return {
        status: true,
        data: job
    }
}

async function isJobPresent(inputs) {
    let job;
    if (inputs.job_id) {
        if (!validator.isUUID(inputs.job_id))
            return errMessage(false, 400, "Job id is not valid.");
        job = await Job.findOne({
            where: { uuid: inputs.job_id }
        });
    }

    if (inputs.title) {
        job = await Job.findOne({
            where: {
                title: inputs.title,
                description: inputs.description,
                company: inputs.company
            }
        });
    }

    return job;
}

module.exports = { validateNewJob, validateGetJob, validateDeleteJob, isJobPresent };