const candidateJobModel = require("../models/candidateJobModel");

module.exports.createApplication = async function (req, res) {
    try {

        let user = req.user;
        let user_id = user["id"];
        let { job_id } = req.body;
        if(user.role == "Recruiter"){
            return res.status(403).json({
                success : false,
                message : "You cannot apply. You are a recruiter"
            })
        }
        
        await candidateJobModel.sync();
        let application = await candidateJobModel.create({
            user_id, job_id
        });

        res.status(201).json({
            success : true,
            data : application
        });

    } catch (err) {
        console.log(err);
        res.json({ err })
    }
}

