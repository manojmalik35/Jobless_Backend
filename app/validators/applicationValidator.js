const CandidateJob = require("../models/candidateJobModel");

async function isApplicationPresent(inputs){
    let application = await CandidateJob.findOne({
        where : {
            UserId : inputs.candidate.id,
            JobId : inputs.job.id
        }
    });

    return application;
}

module.exports = { isApplicationPresent }