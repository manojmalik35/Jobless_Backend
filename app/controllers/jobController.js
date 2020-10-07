const jobModel = require("../models/jobModel");


module.exports.createNewJob = async function(req, res){
    try{

        await jobModel.sync();
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