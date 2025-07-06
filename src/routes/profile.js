const express = require("express")
const Profile = express.Router()
const userAuth = require('../Middleware/UserAuth')
const { error } = require('console');
const {Editvalidation}= require("../utils/validator")
const bcrypt = require('bcrypt');



        
Profile.get("/profile/view",userAuth,async(req,res)=>{
    try{
      
    const user = req.user
    res.send(user)
    
    
    
    }
    catch(err){
        res.status(404).send("Error"+ err.message)
    }})

Profile.patch("/profile/edit",userAuth,async(req,res)=>{

    try{
        const body = req.body
         await Editvalidation(req)
        // if (!isallowed){
        //     throw new Error ("Cannot upDATE")

        // }

        const loggedinuser = req.user
        Object.keys(body).forEach((key)=> (loggedinuser[key]=body[key]))
        await loggedinuser.save();
        res.json({
            message : "Profile has been updated ",
            data: loggedinuser
        })

    }
    catch(err){
        res.status(400).send("Error"+ err.message)
    }







})
    

Profile.patch("/profile/editpassword",userAuth,async(req,res)=>{

try{
    const user = req.user
    const {oldpassWord,newpassWord} = req.body
    const ispasscorrect = await bcrypt.compare( oldpassWord,user.passWord)
    
      if(!ispasscorrect
      )
      { throw new Error ("provided password is incorrect")

      }

      const Hashpassword = await bcrypt.hash(newpassWord, 10 )
        user.passWord = Hashpassword
      
      
              
              
              
                 
     await user.save()

res.send("password change")



}
catch(err){
    res.status(400).send("Error", + err.message)



}





})




    module.exports = Profile