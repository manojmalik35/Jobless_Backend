const Job = require("../models/jobModel");
const User = require("../models/userModel");
require("../models/associations");

class JobService {

    async create(inputs) {
        let job = await Job.create(inputs);
        return job;
    }

    async getJob(inputs) {
        let job = await Job.findOne({
            where: { id: inputs.id }
        });
        return job;
    }

    async getJobs(inputs) {

        let allJobs = await Job.findAll();
        if (inputs.role == 0) {
            return allJobs;
        }

        let appliedJobs = await Job.findAll({
            include: [{
                model: User,
                where: {
                    id: inputs.id
                }
            }]
        });

        allJobs = allJobs.map(job => {
            return job.dataValues;
        })
        appliedJobs = appliedJobs.map(job => {
            return job.dataValues;
        })

        // console.log(appliedJobs);
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
        let jobs = await Job.findAll({
            where: {
                postedById: inputs.id
            }
        });

        return jobs;
    }

    async deleteJob(inputs) {
        await Job.destroy({
            where: {
                id: inputs.id
            }
        });

        return {
            status: "ok",
            message: "Job deleted."
        }
    }
}

module.exports = JobService;

// let appliedJobs = await sequelize.query(`select j.* from jobs j, candidatejobs c where j.id=c.JobId && c.UserId=${inputs.id};`, {
        //     plain: false,
        //     // logging : console.log,
        //     model: Job,
        //     mapToModel: true,
        //     type: QueryTypes.SELECT
        // });