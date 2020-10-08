const candidateJob = require("../models/candidateJobModel");
const Job = require("../models/jobModel")
const User = require("../models/userModel")
const { Email } = require("../utilities/helper");
const sequelize = require("../services/connection")
const { QueryTypes } = require("sequelize");

module.exports.createApplication = async function (req, res) {
    try {

        let candidate = req.user;
        let candidate_id = candidate["id"];
        let { job_id } = req.body;
        if (candidate.role == "Recruiter") {
            return res.status(403).json({
                success: false,
                message: "You cannot apply. You are a recruiter"
            })
        }

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

        res.status(201).json({
            success: true,
            data: application
        });

    } catch (err) {
        console.log(err);
        res.json({ err })
    }
}

module.exports.viewAppliedByCandidates = async function (req, res) {
    let user = req.user;
    if (user.role == "Candidate") {
        return res.status(401).json({
            success: false,
            message: "You are not authorized"
        })
    }

    let job_id = req.params.job_id;
    if (user.role == "Recruiter") {
        let job = await Job.findOne({ where: { id: job_id } });
        if (user.id != job.postedById) {
            return res.status(403).json({
                success: false,
                message: "You did not post this job."
            })
        }
    }

    let applyingUsers = await sequelize.query(`select u.* from users u, candidatejobs c where u.id=c.UserId  && c.JobId=${job_id}`, {
        plain: false,
        // logging : console.log,
        model: User,
        mapToModel: true,
        type: QueryTypes.SELECT
    });

    res.json({
        success: true,
        users: applyingUsers
    })
}

module.exports.viewAppliedJobs = async function (req, res) {
    let user = req.user;
    if (user.role == "Recruiter") {
        return res.status(401).json({
            success: false,
            message: "You are not authorized"
        })
    }

    let candidate_id;
    if (user.role == "Candidate")
        candidate_id = user.id;
    else
        candidate_id = req.params.candidate_id;

    let appliedJobs = await sequelize.query(`select j.* from jobs j, candidatejobs c where j.id=c.JobId && c.UserId=${candidate_id};`, {
        plain: false,
        // logging : console.log,
        model: Job,
        mapToModel: true,
        type: QueryTypes.SELECT
    });

    res.json({
        success: true,
        jobs: appliedJobs
    })
}

