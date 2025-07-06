const validator = require("validator")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const Schema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required:true ,
            index : true,
        },
        lastName : {
            type : String,
        },
        emailId : {
            type : String,
            required:true ,
            unique: true,
            trim:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Email is not Valid")
                }}

        },
        passWord : {
            type : String,
            required:true ,
            unique: true,
        },
        
        gender : {
            type : String,
            validate(value){
                if(!["Male","Female","Others"].includes(value)){
                    throw new Error("Incorrect Gender ")
                }
            }
        },
        
        age : {
            type : Number,
        },
        skills:{

            type:[String],
    
        },
        Bio: {
            type : String,
            default : "Hi I am a developer",
        },
        Photourl: {
            type : String,
            default : "https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-default-male-avatar-png-image_2811083.jpg",
        }



    },
    {
        timestamps: {
          createdAt: 'created_at', // Use `created_at` to store the created date
          updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
      }


      
)
Schema.methods.getjwt = async function (){
    const user = this
    const token = await jwt.sign({_id:user._id},'Somesh',{expiresIn: "1d"})
    return token


}
Schema.methods.validatepassword = async function (passWordenterbyuser){

 const user = this
//  const passwordhash = 

const ispassvalid = await bcrypt.compare( passWordenterbyuser,user.passWord)

return ispassvalid


}
module.exports= mongoose.model("User",Schema)