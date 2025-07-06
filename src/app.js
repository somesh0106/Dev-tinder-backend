const express = require('express')
const connectDb=require ('./config/database');
const app = express();
const cookieParser = require('cookie-parser')
const Auth = require("./routes/auth")
const Profile = require ("./routes/profile")
const Requests = require("./routes/requests")
const userapi = require ("./routes/user")
const cors = require("cors")


try{connectDb().then(()=>{
console.log("DB has been connected")

    app.listen(3000,()=>{
        console.log("server has started")
    })

})}
catch(err){
   console.error
    ("DB connection failed")
}
app.use(cors({
origin: "http://localhost:5173",
credentials: true


}))
app.use(express.json())
app.use(cookieParser())

app.use("/",Auth)
app.use("/",Profile)
app.use("/",Requests)
app.use("/",userapi)





