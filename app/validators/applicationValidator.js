const CandidateJob = require("../models/candidateJobModel");
const jobValidator = require("../validators/jobValidator");

async function isApplicationPresent(inputs) {

    let obj = await jobValidator.isJobPresent(inputs);
    if(!obj.status) return obj;
    let job = obj.data;
    let application = await CandidateJob.findOne({
        where: {
            UserId: inputs.candidate.id,
            JobId: job.id
        }
    });

    return {status : true, data : application, job};
}

async function validateGetApplyingCandidates(inputs){
    let obj = await jobValidator.isJobPresent(inputs);
    if(!obj.status) return obj;
    let job = obj.data;
    return {status : true, data : job};

}

module.exports = { isApplicationPresent, validateGetApplyingCandidates };