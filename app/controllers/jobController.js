const jobModel = require("../models/jobModel");
const candidateJobModel = require("../models/candidateJobModel");

module.exports.createNewJob = async function(req, res){
    try{

        let user = req.user;
        if(user.role !== "Recruiter"){
            return res.status(403).json({
                message : "You are not authorized to post a job."
            })
        }

        await jobModel.sync();
        req.body.postedBy = user.id;
        let job = await jobModel.create(req.body);
        res.status(201).json({
            success : true,
            data : job
        })

    }catch(err){
        res.status(400).json({
            err
        })
    }
}


module.exports.getAllJobs = async function(req, res){
    try{
        let user = req.user;
        if(user.role == "Recruiter"){
            let jobs = await jobModel.findAll({
                where : {
                    postedBy : user.id
                }
            });


            return res.status(200).json({
                success : true,
                jobs : jobs
            })
        }

        let type = req.query.type;
        if(type == "applied"){
            let jobIds = await candidateJobModel.findAll({
                attributes : ['job_id']
            },{
                where : {
                    user_id : user.id
                }
            });

            console.log(jobIds);
            res.status(200).json({
                success : true,
                jobs : jobIds
            })
        }else{

        }

    }catch(err){
        console.log(err);
        res.json({err});
    }
}