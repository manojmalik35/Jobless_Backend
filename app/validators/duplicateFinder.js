const User = require("../models/userModel");
const Job = require("../models/jobModel");

async function isDuplicate(inputs){
    if(inputs.email){
        let user = await User.findOne({
            where : {email : inputs.email}
        });

        if(user)
            return true;
        

        return false;
    }

    if(inputs.user_id){
        let user = await User.findOne({
            where : {
                id : inputs.user_id
            }
        });

        if(user) return true;
        return false;
    }

    if(inputs.job_id){
        let job = await Job.findOne({
            where : {
                id : inputs.job_id
            }
        });

        if(job) return true;
        return false;
    }
}

async function isJobPresent(inputs){
    let job = await Job.findOne({
        where : {
            title : inputs.title,
            package : inputs.package,
            company : inputs.company,
            postedById : inputs.postedById
        }
    });

    if(job) return true;
    return false;
}

module.exports = { isDuplicate, isJobPresent };