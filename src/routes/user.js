const express = require("express")
const userapi = express.Router()
const userAuth = require("../Middleware/UserAuth")
const ConnectionRequestDB = require ("../models/connectionRequests")
const User = require('../models/user')



userapi.get("/users/connectionrequests",userAuth,async (req,res)=>
{

try{

    const loggedinuser= req.user

    const getrequest = await ConnectionRequestDB.find({

      toUserId : loggedinuser._id,
      status : "interested"
    }).populate("fromUserId",["lastName","firstName","Photourl","gender","age","Bio"])


    res.json({ message: "here is your connection list",
        data : getrequest
     })
}
catch(err){

res.status(400).send("Error"+ err.message)

}










})


userapi.get("/connectionrequests/connections",userAuth,async (req,res)=>
{

    try{

        const loggedinuser = req.user

        const connectionrequest = await ConnectionRequestDB.find(
        {$or:[{fromUserId : loggedinuser._id , status : "accepted"},
            {
                toUserId : loggedinuser._id , status :"accepted"
            }

        ]


        }
        ).populate("fromUserId",["lastName","firstName","Photourl","gender","age","Bio"]).populate("toUserId",["lastName","firstName","Photourl","gender","age","Bio"])

        const data = connectionrequest.map((e)=>{

            if ( e.fromUserId._id.toString()=== loggedinuser._id.toString())
            {
              return e.toUserId
            }
            else {
                return e.fromUserId
            }

    })

        res.json({
            data :data
        })




    }
catch(err){
    res.status(400).send("Error"+ err.message)
}










}




)

userapi.get("/users/feed",userAuth,async(req,res)=>{
try{
    const loggedinuser = req.user
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50: limit
    const skip = (page-1)*limit

   const connectionrequest = await ConnectionRequestDB.find(
{$or : [{fromUserId : loggedinuser._id},{toUserId:loggedinuser._id}]


}

   ).select("fromUserId   toUserId")


const hidefromfeed = new Set();
connectionrequest.forEach((req)=>{
hidefromfeed.add(req.fromUserId.toString())
hidefromfeed.add(req.toUserId.toString())
})


const users = await User.find({
$and: [{_id : {$nin : Array.from(hidefromfeed)}},


{   _id : {$ne : loggedinuser._id   }}




]}




).select("firstName   lastName skills Bio Photourl gender age").skip(skip).limit(limit)
// console.log(hidefromfeed)
res.send(users)



}


catch(err){
 res.status(400).send("Error" + err.message)
}




})
module.exports = userapi


