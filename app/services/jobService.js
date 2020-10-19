const Job = require("../models/jobModel");
const { succMessage, errMessage } = require("../utilities/helper");
require("../models/associations");
const jobValidator = require("../validators/jobValidator");
const { isUserPresent } = require("../validators/userValidator");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const CandidateJob = require("../models/candidateJobModel")

class JobService {

    async create(inputs) {
        let isValid = await jobValidator.validateNewJob(inputs);
        if (!isValid.status) return isValid;

        let job = await Job.create(inputs);
        return {
            status: true,
            data: job
        }
    }

    async getJob(inputs) {
        let isValid = await jobValidator.validateGetJob(inputs);
        if (!isValid.status) return isValid;

        let job = isValid.data;
        return {
            status: true,
            data: job
        }
    }

    async getJobs(inputs) {

        let count = 0;
        let jobs;
        if (inputs.role == 0) {
            let allJobs = await Job.findAll({
                order: [
                    ["updatedAt", "DESC"]
                ],
                limit: process.env.PAGINATION_LIMIT,
                offset: inputs.page && inputs.page > 0 ? (inputs.page - 1) * process.env.PAGINATION_LIMIT : 0
            });
            count = await Job.count({});
            allJobs = allJobs.map(job => {
                return job.dataValues;
            })
            jobs = allJobs;
        } else if (inputs.role == 1) {
            let postedJobs = await Job.findAll({
                where: {
                    postedById: inputs.id
                },
                order: [
                    ["updatedAt", "DESC"]
                ],
                limit: process.env.PAGINATION_LIMIT,
                offset: inputs.page && inputs.page > 0 ? (inputs.page - 1) * process.env.PAGINATION_LIMIT : 0
            });

            count = await Job.count({
                where: {
                    postedById: inputs.id
                },
            });
            postedJobs = postedJobs.map(job => {
                return job.dataValues;
            })
            jobs = postedJobs;
        } else {

            let appliedJobIds = await CandidateJob.findAll({
                attributes: ['JobId'],
                where: {
                    UserId: inputs.id
                }
            });
            appliedJobIds = appliedJobIds.map(jobId => {
                return jobId.dataValues.JobId;
            })

            let availableJobs = await Job.findAll({
                where: {
                    id: {
                        [Op.notIn]: appliedJobIds
                    }
                },
                order: [
                    ["updatedAt", "DESC"]
                ],
                limit: process.env.PAGINATION_LIMIT,
                offset: inputs.page && inputs.page > 0 ? (inputs.page - 1) * process.env.PAGINATION_LIMIT : 0
            });
            count = await Job.count({
                where: {
                    id: {
                        [Op.notIn]: appliedJobIds
                    }
                }
            })
            availableJobs = availableJobs.map(job => {
                return job.dataValues;
            })
            jobs = availableJobs;
        }

        return { jobs, count };
    }

    async getPostedJobs(inputs) {
        inputs.user_id = inputs.recruiter_id;
        let user = await isUserPresent(inputs);
        if (!user) return errMessage(false, 400, "Recruiter does not exist.");
        let postedJobs = await Job.findAll({
            where: {
                postedById: user.id
            },
            order: [
                ["updatedAt", "DESC"]
            ],
            limit: process.env.PAGINATION_LIMIT,
            offset: inputs.page && inputs.page > 0 ? (inputs.page - 1) * process.env.PAGINATION_LIMIT : 0
        });

        let count = await Job.count({
            where: {
                postedById: user.id
            }
        });
        postedJobs = postedJobs.map(job => {
            return job.dataValues;
        })

        return {jobs : postedJobs, count};
    }

    async deleteJob(inputs) {
        let isValid = await jobValidator.validateDeleteJob(inputs);
        if (!isValid.status) return isValid;
        let job = isValid.data;
        await Job.destroy({
            where: {
                id: job.id
            }
        });

        return succMessage(true, 200, null, "Job successfully deleted");
    }
}

module.exports = JobService;