const candidateJob = require("../models/candidateJobModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const { errMessage, succMessage, Email } = require("../utilities/helper");
const applicationValidator = require("../validators/applicationValidator");
const jobValidator = require("../validators/jobValidator");
const userValidator = require("../validators/userValidator");

class ApplicationService{

    async create(inputs){
        let job = await jobValidator.isJobPresent(inputs);
        if(!job) return errMessage(false, 400, "Job does not exist.");
        inputs.job = job;
        let application = await applicationValidator.isApplicationPresent(inputs);
        if(application) return errMessage(false, 400, "You have already applied for this job.");
        let {candidate} = inputs;
        application = await candidateJob.create({
            UserId: candidate.id,
            JobId: job.id
        });

        let recruiter = await User.findOne({
            where: { id: job.postedById }
        });

        let message = {
            to: candidate.email,
            subject: "Successfully applied for the job",
            html: `<b>Congratulations! ${candidate.name}, You have successfully applied for the job ${job.title} posted by the company ${job.company}</b>`
        };

        Email(message);
        message = {
            to: recruiter.email,
            subject: "Received application for a job",
            html: `<b>Hello! ${recruiter.name}, We are pleased to inform you that a candidate named ${candidate.name} has successfully applied for the job ${job.title} posted by you.</b>`
        };
        Email(message);
        return {status : true, data : application};
    }

    async getAppliedJobs(inputs){
        inputs.user_id = inputs.candidate_id;
        let user = await userValidator.isUserPresent(inputs);
        if(!user) return errMessage(false, 400, "Candidate does not exist.")
        let appliedJobs = await Job.findAll({
            include: [{
                model: User,
                where: {
                    id: user.id
                }
            }]
        });

        appliedJobs = appliedJobs.map(job => {
            return job.dataValues;
        })
        return {status : true, data : appliedJobs};
    }

    async getAppliedByCandidates(inputs){
        let job = await jobValidator.isJobPresent(inputs);
        if(!job) return errMessage(false, 400, "Job does not exist.");
        if(job.postedById != inputs.user_id){
            return errMessage(false, 403, "You did not post this job.");
        }

        let applyingUsers = await User.findAll({
            include : [{
                model : Job,
                where : {
                    id : job.id
                }
            }]
        });
        
        applyingUsers = applyingUsers.map(user => {
            return user.dataValues;
        })

        return {status : true, data : applyingUsers};
    }
}

module.exports = ApplicationService;