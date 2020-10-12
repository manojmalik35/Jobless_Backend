const validate = require("../validators/validator");
const JobService = require("../services/jobService");
const { isDuplicate, isJobPresent } = require("../validators/duplicateFinder");

const jobService = new JobService();

module.exports.createNewJob = async function (req, res) {
    // try {

    let user = req.user;
    let inputs = req.body;
    let isValid = validate(inputs);
    if (isValid.status == "error") {
        return res.status(400).json(isValid);
    }

    inputs.postedById = user.id;
    let isPresent = await isJobPresent(inputs);
    if (isPresent){
        return res.status(400).json({
            status : "error",
            code : 400,
            message : "Job already present."
        });
    }


    let job = await jobService.create(inputs);
    // await user.addJob(job);
    // console.log((await user.getJobs()).toJSON());
    job.dataValues.id = undefined;
    res.status(201).json({
        status: "ok",
        data: job
    })

    // } catch (err) {
    //     console.log(err);
    //     res.status(400).json({
    //         err
    //     })
    // }
}

module.exports.getJob = async function (req, res) {
    // try{

    let job_id = req.params.job_id;
    let inputs = { id: job_id };
    let isValid = validate(inputs);
    if (isValid.status == "error") {
        return res.status(400).json(isValid);
    }

    inputs.job_id = job_id;
    let isPresent = await isDuplicate(inputs);
    if (!isPresent)
        return res.status(400).json(errMessage("error", 400, "id", "Job not found"))

    let job = await jobService.getJob(inputs);
    job.dataValues.id = undefined;
    res.status(200).json({
        status: "ok",
        data: job
    })
    // }catch(err){
    //     console.log(err);
    //     res.json({err})
    // }
}


module.exports.getJobs = async function (req, res) {
    // try {
    let user = req.user;
    let inputs = { role: (user.role + ""), id: user.id + "" };
    let isValid = validate(inputs);
    if (isValid.status == "error") {
        return res.status(400).json(isValid);
    }

    let jobs = await jobService.getJobs(inputs);
    for (let i = 0; i < jobs.length; i++) {
        jobs[i].id = undefined;
    }

    res.status(200).json({
        status: "ok",
        jobs: jobs
    })


    // } catch (err) {
    //     console.log(err);
    //     res.json({ err });
    // }
}

module.exports.getPostedJobs = async function (req, res) {
    // try {
    let recruiter_id = req.params.recruiter_id;
    let inputs = { id: recruiter_id };
    let isValid = validate(inputs);
    if (isValid.status == "error") {
        return res.status(400).json(isValid);
    }

    inputs.user_id = recruiter_id;
    let isPresent = await isDuplicate(inputs);
    if (!isPresent)
        return res.status(400).json(errMessage("error", 400, "id", "User not found"))

    let jobs = await jobService.getPostedJobs(inputs);
    for (let i = 0; i < jobs.length; i++) {
        jobs[i].id = undefined;
    }

    return res.status(200).json({
        status: "ok",
        jobs: jobs
    })

    // } catch (err) {
    //     console.log(err);
    //     res.json({ err });
    // }
}

module.exports.deleteJob = async function (req, res) {
    // try {
    let job_id = req.params.job_id;
    let inputs = { id: job_id };
    let isValid = validate(inputs);
    if (isValid.status == "error") {
        return res.status(400).json(isValid);
    }

    inputs.job_id = job_id;
    let isPresent = await isDuplicate(inputs);
    if (!isPresent)
        return res.status(400).json(errMessage("error", 400, "id", "Job not found"))

    let result = await jobService.deleteJob(inputs);
    res.status(200).json(result);
    // } catch (err) {
    //     console.log(err);
    //     res.json({ err });
    // }
}


// module.exports.updateJob = async function (req, res) {
//     try {

//         let user = req.user;
//         if (user.role == "Candidate") {
//             return res.status(401).json({
//                 message: "You are not authorized."
//             })
//         }

//         let job_id = req.params.job_id;
//         let updateObj = req.body;
//         await Job.update(updateObj, {
//             where: {
//                 id: job_id
//             }
//         });

//         res.status(200).json({
//             success: true
//         });
//     } catch (err) {
//         console.log(err);
//         res.json({ err });
//     }
// }