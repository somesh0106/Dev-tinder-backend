const mongoose = require("mongoose")
const connectDb = async()=>
{
await mongoose.connect("mongodb+srv://someshdwivedi07:KyfXTvc0Ej7mkVMP@cluster0.qtebx.mongodb.net/DevTinder")
}
module.exports=connectDb;
