const JOI            = require('@hapi/joi');
const JWT            = require('jsonwebtoken');

class Validator{
    constructor(){}

    validateToken(req){
        const token = req.headers.token;

        if(!token) return {valid: false, message: "Oops! We encountered an issue with your session"};

        try {
            const verified = JWT.verify(token, process.env.JWT_SECRET);
            let tokenTimeStamp = new Date(verified.iat);

            let tokenTime = tokenTimeStamp * 1000
            let currentTime = new Date()
            let tokenExpiry = new Date(new Date(tokenTime).setHours(new Date(tokenTime).getHours() + 24));

            if(currentTime > tokenExpiry){
                return {valid: false, message:"This session has expired"};
            } else{
                return {valid: true, user: verified.id, message:"Successfull token validation"};
            }

        } catch (err) {
            return {valid: false, message:err + "Oops! We encountered an issue, please try again..."};
        }
    }

    validateRegister(req){
        let valid;
        let message = "";

        this.schema = JOI.object({
            email       : JOI.string().email().required(),
            password    : JOI.string().min(8).max(20).required(),
            firstname   : JOI.string().min(1).max(150).required(),
            lastname    : JOI.string().min(1).max(150).required(),
            phoneNumber : JOI.string().min(1).max(12).required(),
            firstLineAddress : JOI.string().min(1).max(250).required(),
            city             : JOI.string().min(1).max(150).required(),
            postcode         : JOI.string().min(1).max(7).required(),
            hash             : JOI.string()
        })
    
        this.validationResult = this.schema.validate(req.body);

        if(this.validationResult.hasOwnProperty("error") === false){
            valid = true;
        }else{
            valid = false;
            message = this.validationResult.error.details[0].message;
        }

        return {valid:valid, message:message}
    }

    validateLogin(req){
        let valid;
        let message = "";

        this.schema = JOI.object({
            email       : JOI.string().email().required(),
            password    : JOI.string().min(8).max(20).required(),
        })
    
        this.validationResult = this.schema.validate(req.body);

        if(this.validationResult.hasOwnProperty("error") === false){
            valid = true;
        }else{
            valid = false;
            message = this.validationResult.error.details[0].message;
        }

        return {valid:valid, message:message}
    }
   
}

module.exports.Validator = Validator;