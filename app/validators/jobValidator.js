const validator = require("validator");
const { errMessage, succMessage } = require("../utilities/helper");
const Job = require("../models/jobModel");

async function validateNewJob(inputs) {
    if (!inputs.title)
        return errMessage(false, 422, "Title is required.");
    if (!inputs.description)
        return errMessage(false, 422, "Description is required.");
    if (!inputs.company)
        return errMessage(false, 422, "Company is required.");

    if (!validator.isLength(inputs.title, { min: 5, max: 100 }))
        return errMessage(false, 422, "Please enter valid job title.");
    if (!validator.isLength(inputs.description, { min: 10, max: 1000 }))
        return errMessage(false, 422, "Please enter a description of at least 10 characters.");
    if (!validator.isLength(inputs.company, { min: 5, max: 1000 }))
        return errMessage(false, 422, "Please enter a valid company name");
    if (inputs.package) {
        if (!validator.isNumeric(inputs.package))
            return errMessage(false, 422, "Please enter a valid package.");
    }

    let job = await Job.findOne({
        where: {
            title: inputs.title,
            description: inputs.description,
            company: inputs.company
        }
    });
    if (job)
        return errMessage(false, 400, "Job already exists.");

    return {
        status: true
    }
}

async function validateGetJob(inputs) {
    if (!inputs.job_id)
        return errMessage(false, 422, "Job id is required.");

    if (!validator.isUUID(inputs.job_id))
        return errMessage(false, 422, "Job id is not valid.");

    let job = await Job.findOne({
        where: { uuid: inputs.job_id }
    });
    if (!job) return errMessage(false, 400, "Job does not exist.");
    return {
        status: true,
        data: job
    }
}

async function validateDeleteJob(inputs) {
    if (!inputs.job_id)
        return errMessage(false, 422, "Job id is required.");

    if (!validator.isUUID(inputs.job_id))
        return errMessage(false, 422, "Job id is not valid.");

    let job = await Job.findOne({
        where: { uuid: inputs.job_id }
    });
    if (!job)
        return errMessage(false, 400, "Job does not exist.");

    return {
        status: true,
        data: job
    }
}

async function isJobPresent(inputs) {
    if (inputs.job_id) {
        if (!validator.isUUID(inputs.job_id))
            return errMessage(false, 422, "Job id is not valid.");
        let job = await Job.findOne({
            where: { uuid: inputs.job_id }
        });
        if(job)
            return succMessage(true, 200, job, "Job present.");

        return errMessage(false, 400, "Job not present.");
    }

    return errMessage(false, 422, "Job id is required.");
}

module.exports = { validateNewJob, validateGetJob, validateDeleteJob, isJobPresent };