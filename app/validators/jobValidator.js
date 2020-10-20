const validator = require("validator");
const { errMessage, succMessage } = require("../utilities/helper");
const Job = require("../models/jobModel");

async function validateNewJob(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.title)
        errors.title = "Title is required.";
    else if (inputs.title.length < 3){
        errors.title = "Job title is too short.";
        status = 422;
    }
    else if (inputs.title.length > 30){
        errors.title = "Job title is too long.";
        status = 422;
    }
    

    if (!inputs.description)
        errors.description = "Description is required.";
    else if (!validator.isLength(inputs.description, { min: 10, max: 700 })){
        errors.description = "Please enter a description of at least 10 characters.";
        status = 422;
    }

    if (!inputs.company)
        errors.company = "Company is required.";
        else if (inputs.company.length < 3){
            errors.title = "Company name is too short.";
            status = 422;
        }
    else if (inputs.company.length > 25){
        errors.title = "Company name is too long.";
        status = 422;
    }

    if (inputs.package) {
        if (!validator.isAlphanumeric(validator.blacklist(inputs.package, ' '))){
            errors.package = "Package is not valid. Enter either number or like 5 lpa.";
            status = 422;
        }
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);

    let job = await Job.findOne({
        where: {
            title: inputs.title,
            description: inputs.description,
            company: inputs.company
        }
    });
    if (job)
        return errMessage(false, 422, "Job already exists.");

    return {
        status: true
    }
}

async function validateGetJob(inputs) {
    let errors = {};
    let status = 400;
    if (!inputs.job_id)
        errors.job_id = "Job id is required.";
    else if (!validator.isUUID(inputs.job_id)){
        errors.job_id = "Job id is not valid.";
        status = 422;
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);

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
    let errors = {};
    let status = 400;
    if (!inputs.job_id)
        errors.job_id = "Job id is required.";
    else if (!validator.isUUID(inputs.job_id)){
        errors.job_id = "Job id is not valid.";
        status = 422;
    }

    if (Object.keys(errors).length > 0)
        return errMessage(false, status, errors);

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
        if (job)
            return succMessage(true, 200, job, "Job present.");

        return errMessage(false, 400, "Job not present.");
    }

    return errMessage(false, 400, "Job id is required.");
}

module.exports = { validateNewJob, validateGetJob, validateDeleteJob, isJobPresent };