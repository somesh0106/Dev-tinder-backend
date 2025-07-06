const express = require ("express")
const Auth = express.Router()
const {validatorDone } = require('../utils/validator')
const { error } = require('console');

const User = require('../models/user')
const bcrypt = require('bcrypt');




Auth.get("/user",async (req,res)=>
    {
    const first = req.body.firstName
    try{
        console.log(first)
        const name = await User.find({firstName :first})
        if (name.length === 0){
            res.send("user not found")
    
        }
        else{
            res.send(name)
        }
        
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message)
    }
    
    
    
    
    })
Auth.delete("/deleteuser",async(req,res)=>
        {
            const userId = req.body.userId
            try{
                const deleteUser = await User.findByIdAndDelete(userId)
                // or const deleteUser = await User.findByIdAndDelete(_Id: userId)
                res.send("user jas been deleted")
        
            }
            catch(err){
                res.status(404).send("ERROR : " + err.message)
        
            }
        
        
        }
        )
Auth.post("/Signup", async (req,res)=>{
            try{   validatorDone(req)
                const {passWord,emailId,lastName,firstName} = req.body
                const Hashpassword = await bcrypt.hash(passWord, 10 )
        
        
        const user = new User (
            {passWord : Hashpassword,emailId,lastName,firstName})
        
           
        
        
            const saveduser=await user.save()
            // const token = await saveduser.getjwt()
            // res.cookie('token',token,{
            //     expires: new Date(Date.now()+ 24*3600000)
            //   })
            res.json({message: "User Saved Successfully", data :saveduser})
        
        }
        catch(err){
            res.status(400).send("ERROR : " + err.message)
        }
        
        
        
        
        })
        
        
        
Auth.get("/feed", async (req, res) => {
            try {
                const names = await User.find({});
                if (names.length === 0) {
                    res.send("No users found");
                } else {
                    res.send(names);
                }
            } catch (err) {
                console.error(err); // Log the error for debugging
                res.status(500).send("ERROR : " + err.message);
            }
        });
        
        
// Auth.patch("/user/:userId",async (req,res)=>{
//         const userId= req.params?.userId
//         const data = req.body
//         try{
//             const Allowed =["Bio","skills","gender"]
//             const isUpdateallowed= Object.keys(data).every((k)=>
//                 Allowed.includes(k)) 
//             if(!isUpdateallowed){
//                 throw new Error("Cannot update")
//             }
//         if(data.skills){
//             data?.skills.length>10
//             throw new Error("Skills cannot be more than 10")
//         }
//         const userData = await User.findByIdAndUpdate({_id:userId}, data,{runValidators:true})
//         console.log(data)
        
//         res.send( "User has been updated" )
//         }
//         catch(err){
//             res.status(404).send("ERROR : " + err.message)
        
//         }
        
//         })
            
        
Auth.post("/login",async(req,res)=>{
        
        try{
        const { passWord, emailId}= req.body;
        const user = await User.findOne({emailId : emailId})
        if (!user){
            throw new Error ("Invalid Credentials")
        }
        const ispassvalid = await user.validatepassword(passWord)
        if (ispassvalid){
                 const token = await user.getjwt()
            res.cookie('token',token,{
                expires: new Date(Date.now()+ 24*3600000)
              })
        
            res.send(user)
            
        }
        else {
            throw new Error ("Invalid Credentials")
        }
        
        }
        catch(err){
            res.status(404).send("ERROR : " + err.message)
        
        }
        
        })    
          

Auth.post("/logout",(req,res)=>{
// res.cookie("token",null,{expires: new Date(Date.now())})
res.clearCookie("token")
res.send("Logout Successfully")






})        

        module.exports = Auth
