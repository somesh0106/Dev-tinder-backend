const jwt = require("jsonwebtoken")
const User = require("../models/user")


const userAuth = async (req,res,next)=>{

try{
  const {token}=req.cookies
  if (!token){
    return res.status(401).send("Please login")
  }
  const decoded = await jwt.verify(token,"Somesh")
  const {_id}= decoded
  const user = await User.findById(_id)
  if(!user)
  {
    throw new Error("Please login")
    

  }
  req.user=user  
  next()

}
catch{
    res.status(400).send("Error"+ err.message)
}
}

module.exports = 
    userAuth


