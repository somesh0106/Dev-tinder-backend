const validator = require("validator")

const validatorDone =(req)=>
{
const {passWord,emailId,lastName,firstName} = req.body
if (!lastName || !firstName){
    throw new Error("Required fields are missing")
}
else if(!validator.isEmail(emailId)){
                    throw new Error("Email is not Valid")
                }
                else if(!validator.isStrongPassword(passWord)){
                    throw new Error("password is not Valid")
                }                



}

const Editvalidation= (req)=>{
const body = req.body
const iseditallowed= ["lastName","firstName","gender","age","skills","Bio","Photourl"]
const allowed= Object.keys(body).every((k)=>
    iseditallowed.includes(k)
)
if(!allowed)
{
    throw new Error("Can't update")
}


}






module.exports = {
    validatorDone,Editvalidation
}