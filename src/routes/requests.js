const express = require("express")
const Requests = express.Router()
const { error } = require('console');
const ConnectionRequestDB = require ("../models/connectionRequests")
const User = require ("../models/user")
const userAuth = require('../Middleware/UserAuth')

Requests.post("/requests/:status/:toUserId",userAuth,async (req,res)=>{
    try{const user = req.user
    const fromUserId = user._id
    const toUserId = req.params.toUserId
    const status = req.params.status
    
    const isAllowedStatus=["interested","ignored"]
    
    const isAllowedStatusCheck =  isAllowedStatus.includes(status)
    if(!isAllowedStatusCheck)
    {
        return res.status(400).json({ message: "Invalid Status Request" });
    
    }
    
    
    const alreadyexists = await ConnectionRequestDB.findOne(
    {$or:[{fromUserId:fromUserId , toUserId:toUserId},
        {fromUserId:toUserId, toUserId:fromUserId}]
    }
    )
    if (alreadyexists){
    
        return res.status(400).json({message: "Request already exists"})
    }
    
    
    const requestuserexists = await User.findById(toUserId)
    if(!requestuserexists){
    
        return res.status(400).json({message:"user doesn't exists in our database"})
    
    
    }
    
    const ConnectionRequestHAVE = new ConnectionRequestDB(
        {fromUserId:fromUserId,
            toUserId:toUserId,
            status : status}
    
    )
    ConnectionRequestHAVE.save()
    
    res.send ("Request has been sent")}
    catch(err){
    res.status(400).send("Error:" +err.message)
    
    }
    
    
    
    
    }) //Feed

Requests.post ("/profile/:status/:userId",userAuth,async (req,res)=>{

try {const loggedinuser = req.user
const {status,userId} = req.params
const isallowedstatus = ["rejected","accepted"]

const isallowed = isallowedstatus.includes(status)
if (!isallowed){
    return res.status(400).json({message:"Invalid status"})

}
const isallowedresponse = await ConnectionRequestDB.findOne({
    fromUserId : userId,
    toUserId : loggedinuser._id,
    status: "interested",


})

if (!isallowedresponse){
    return res.status(400).json({message : "cannot send requests "})
}

isallowedresponse.status = status;    
await isallowedresponse.save();  
res.send("You have "+ status+ "this userid")
}
catch(err){

    res.status(400).send("Error"+ err.message)
}



})

module.exports = Requests