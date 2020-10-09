const validator = require("validator");
const {errMessage} = require("../utilities/helper");

function validate(inputs) {

    if(inputs.email){
        if(!validator.isEmail(inputs.email)){
            return errMessage("error", 101, "email_id", "Email id is not valid.");
        }
    }

    if(inputs.name){
        if(!validator.isAlpha(inputs.name)){
            return errMessage("error", 102, "name", "Your name cannot have numbers or special characters.")
        }
    }

    if(inputs.role){
        if(!validator.isIn(inputs.role, [0, 1, 2])){
            return errMessage("error", 103, "role", "Your role can either be recruiter or a candidate.");
        }
    }

    if(inputs.phone){
        if(!validator.isMobilePhone(inputs.phone)){
            return errMessage("error", 104, "phone", "Invalid phone number");
        }
    }




    return {
        status : "ok",
        code : 200
    }
    
}

module.exports = validate;