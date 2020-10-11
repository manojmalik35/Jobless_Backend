const candidateJob = require("../models/candidateJobModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const { Email } = require("../utilities/helper");

class ApplicationService{

    async create(inputs){
        let {candidate, job_id} = inputs;
        let candidate_id = candidate.id;
        let application = await candidateJob.create({
            UserId: candidate_id,
            JobId: job_id
        });

        let job = await Job.findOne({
            where: { id: job_id }
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
        return application;
    }

    async getAppliedJobs(inputs){
        let appliedJobs = await Job.findAll({
            include: [{
                model: User,
                where: {
                    id: inputs.id
                }
            }]
        });

        appliedJobs = appliedJobs.map(job => {
            return job.dataValues;
        })
        return appliedJobs;
    }

    async getAppliedByCandidates(inputs){

        let applyingUsers = await User.findAll({
            include : [{
                model : Job,
                where : {
                    id : inputs.job_id
                }
            }]
        });
        
        applyingUsers = applyingUsers.map(user => {
            return user.dataValues;
        })

        return applyingUsers;
    }
}

module.exports = ApplicationService;