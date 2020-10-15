const Job = require("../models/jobModel");
const User = require("../models/userModel");
const { succMessage, errMessage } = require("../utilities/helper");
require("../models/associations");
const jobValidator = require("../validators/jobValidator");
const { isUserPresent } = require("../validators/userValidator");

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
        let allJobs = await Job.findAll({
            order: [
                ["updatedAt", "DESC"]
            ],
            limit: 2,
            offset: inputs.page && inputs.page > 0 ? (inputs.page - 1) * 2 : 0
        });
        count = await Job.count({});
        allJobs = allJobs.map(job => {
            return job.dataValues;
        })
        if (inputs.role == 0) {
            return {jobs : allJobs , count};
        }

        if (inputs.role == 1) {
            let postedJobs = await Job.findAll({
                where: {
                    postedById: inputs.id
                },
                order: [
                    ["updatedAt", "DESC"]
                ],
                limit: 20,
                offset: inputs.page && inputs.page > 0 ? (inputs.page - 1) * 20 : 0
            });

            // count = await Job.count({});
            postedJobs = postedJobs.map(job => {
                return job.dataValues;
            })
            return postedJobs;
        }

        let appliedJobs = await Job.findAll({
            include: [{
                model: User,
                where: {
                    id: inputs.id
                },
                order: [
                    ["updatedAt", "DESC"]
                ]
            }],
            limit : 20,
            offset : inputs.page && inputs.page > 0 ? (inputs.page - 1) * 20 : 0
        });

        appliedJobs = appliedJobs.map(job => {
            return job.dataValues;
        })

        let availableJobs = allJobs.filter(job => {
            for (let i = 0; i < appliedJobs.length; i++) {
                if (appliedJobs[i].id === job.id)
                    return false;
            }
            return true;
        });

        return availableJobs;
    }

    async getPostedJobs(inputs) {
        inputs.user_id = inputs.recruiter_id;
        let user = await isUserPresent(inputs);
        if (!user) return errMessage(false, 400, "Recruiter does not exist.");
        let jobs = await Job.findAll({
            where: {
                postedById: user.id
            },
            order: [
                ["updatedAt", "DESC"]
            ]
        });

        return jobs;
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