const JobService = require("../services/jobService");
const { succMessage, errMessage } = require("../utilities/helper");

const jobService = new JobService();

module.exports.createNewJob = async function (req, res) {
    let user = req.user;
    let inputs = req.body;
    inputs.postedById = user.id;
    let obj = await jobService.create(inputs);
    if (!obj.status) return res.status(obj.code).json(obj);
    let job = obj.data;
    res.status(201).json(succMessage(true, 201, {
        uuid: job.dataValues.uuid,
        title: job.dataValues.title,
        description: job.dataValues.description,
        package: job.dataValues.package,
        company: job.dataValues.company,
        createdAt : job.dataValues.createdAt
    }, "Job successfully posted."));
}

module.exports.getJob = async function (req, res) {

    let inputs = req.params;
    let obj = await jobService.getJob(inputs);
    if(!obj.status) return res.status(obj.code).json(obj);
    let job = obj.data;
    res.status(200).json(succMessage(true, 200, {
        uuid: job.dataValues.uuid,
        title: job.dataValues.title,
        description: job.dataValues.description,
        package: job.dataValues.package,
        company: job.dataValues.company
    }, "Job successfully fetched."));
}


module.exports.getJobs = async function (req, res) {

    let user = req.user;
    let inputs = { role: user.role, id: user.id };
    let jobs = await jobService.getJobs(inputs);
    if(!jobs) return res.status(200).json(succMessage(true, 200, null, "No jobs"))
    jobs = jobs.map(job => {
        return {
            uuid: job.uuid,
            title: job.title,
            description: job.description,
            package: job.package,
            company: job.company
        }
    });
    res.status(200).json(succMessage(true, 200, jobs, "Jobs successfully fetched."));
}

module.exports.getPostedJobs = async function (req, res) {
    
    let inputs = req.params;
    let jobs = await jobService.getPostedJobs(inputs);
    if(!jobs) return res.status(200).succMessage(true, 200, null, "No jobs posted.");
    jobs = jobs.map(job => {
        return {
            uuid: job.dataValues.uuid,
            title: job.dataValues.title,
            description: job.dataValues.description,
            package: job.dataValues.package,
            company: job.dataValues.company
        }
    });    

    return res.status(200).json(succMessage(true, 200, jobs, "Jobs successfully fetched."));
}

module.exports.deleteJob = async function (req, res) {
    
    let inputs = req.params;
    let result = await jobService.deleteJob(inputs);
    res.status(result.code).json(result);
}