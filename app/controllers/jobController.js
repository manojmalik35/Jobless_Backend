const Job = require("../models/jobModel");
require("../models/associations");
const sequelize = require("../configs/connection")
const { QueryTypes } = require("sequelize");

module.exports.createNewJob = async function (req, res) {
    try {

        let user = req.user;
        if (user.role !== "Recruiter") {
            return res.status(403).json({
                message: "You are not authorized to post a job."
            })
        }

        let jobObj = req.body;
        jobObj.postedById = user.id;
        let job = await Job.create(jobObj);
        // await user.addJob(job);
        // console.log((await user.getJobs()).toJSON());
        res.status(201).json({
            success: true,
            data: job
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            err
        })
    }
}

module.exports.getJob = async function(req, res){
    try{

        let job_id = req.params.job_id;
        let job = await Job.findOne({
            where : {id : job_id}
        });

        res.status(200).json({
            success : true,
            job : job
        })
    }catch(err){
        console.log(err);
        res.json({err})
    }
}


module.exports.getJobs = async function (req, res) {
    try {
        let user = req.user;
        let uid = user.id;

        let allJobs = await Job.findAll();
        if (user.role == "Admin") {
            return res.status(200).json({
                success: true,
                jobs: allJobs
            })
        }

        if(user.role == "Recruiter"){
            return res.status(400).json({
                message : "Something went wrong!"
            })
        }

        let appliedJobs = await sequelize.query(`select j.* from jobs j, candidatejobs c where j.id=c.JobId && c.UserId=${uid};`, {
            plain: false,
            // logging : console.log,
            model: Job,
            mapToModel: true,
            type: QueryTypes.SELECT
        });
        allJobs = allJobs.map(job => {
            return job.dataValues;
        })
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

        res.status(200).json({
            success: true,
            jobs: availableJobs
        })


    } catch (err) {
        console.log(err);
        res.json({ err });
    }
}

module.exports.getPostedJobs = async function (req, res) {
    try {
        let user = req.user;
        if (user.role == "Candidate") {
            res.status(401).json({
                message: "You are not authorized"
            })
        }

        let recruiter_id = req.params.recruiter_id;
        let jobs = await Job.findAll({
            where: {
                postedById: recruiter_id
            }
        });

        return res.status(200).json({
            success: true,
            jobs: jobs
        })

    } catch (err) {
        console.log(err);
        res.json({ err });
    }
}

module.exports.deleteJob = async function (req, res) {
    try {

        let user = req.user;
        if (user.role == "Candidate") {
            return res.status(401).json({
                message: "You are not authorized."
            })
        }

        let job_id = req.params.job_id;
        await Job.destroy({
            where: {
                id: job_id
            }
        });

        res.status(200).json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.json({ err });
    }
}


module.exports.updateJob = async function (req, res) {
    try {

        let user = req.user;
        if (user.role == "Candidate") {
            return res.status(401).json({
                message: "You are not authorized."
            })
        }

        let job_id = req.params.job_id;
        let updateObj = req.body;
        await Job.update(updateObj, {
            where: {
                id: job_id
            }
        });

        res.status(200).json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.json({ err });
    }
}