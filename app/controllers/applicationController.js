const ApplicationService = require("../services/applicationService");
const { succMessage} = require("../utilities/helper");

const applicationService = new ApplicationService();

module.exports.createApplication = async function (req, res) {
    
        let candidate = req.user;
        let inputs = req.body;
        inputs.candidate = candidate;
        let obj = await applicationService.create(inputs);
        if(!obj.status) return res.status(obj.code).json(obj);
        res.status(201).json(succMessage(true, 201, null, "You have successfully applied for the job."));
}

module.exports.viewAppliedByCandidates = async function (req, res) {
    let inputs = req.params;
    inputs.user_id = req.user.id;
    let obj = await applicationService.getAppliedByCandidates(inputs);
    if(!obj.status) return res.status(obj.code).json(obj);
    let applyingUsers = obj.data;
    if(applyingUsers.length == 0) return res.status(200).json(succMessage(true, 200, applyingUsers, "No candidates applied for this job."))
    applyingUsers = applyingUsers.map(user=>{
        return {
            uuid : user.uuid,
            name : user.name,
            email : user.email,
            phone : user.phone
        }
    })

    res.status(200).json(succMessage(true, 200, applyingUsers, "These are the candidates who applied for this job."));
}

module.exports.viewAppliedJobs = async function (req, res) {
    let user = req.user;
    let inputs = {};
    if(user.role == 0)
        inputs = req.params;
    else
        inputs.candidate_id = user.uuid;

    inputs.page = req.query.page;
    let obj = await applicationService.getAppliedJobs(inputs);
    if(!obj.status) return res.status(obj.code).json(obj);
    let appliedJobs = obj.data;
    let count = obj.count;
    appliedJobs = appliedJobs.map(job=>{
        return {
            uuid : job.uuid,
            title : job.title,
            description : job.description,
            package : job.package,
            company : job.company
        }
    })

    res.status(200).json({
        status : true,
        code : 200,
        data : appliedJobs,
        message : "Applied jobs successfully fetched.",
        metadata : {
            resultset : {
                limit : process.env.PAGINATION_LIMIT,
                count : count
            }
        }
    });
}

