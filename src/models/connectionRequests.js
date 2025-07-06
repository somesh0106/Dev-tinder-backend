const mongoose = require("mongoose")
const { applyTimestamps } = require("./user")
const connectionRequestScehma = new mongoose.Schema(
{
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"

    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"

    },
    status:
    {
        type: "string",
        enum : [
            "interested","ignored","rejected","accepted"

        ],
        message:'{Value}is incorrect status type' 

    }

},


{timestamps:true}
)

connectionRequestScehma.pre('save', function(next) {
    ConnectionRequestDB = this
    const checkId =  ConnectionRequestDB.fromUserId.equals(ConnectionRequestDB.toUserId)
if (checkId)
{
    return res.status(400).json({mesaage:"you cannot send request to yourself"})

}
    next();
  });

connectionRequestScehma.index({toUserId :1,fromUserId :1})
const connectionRequestModel = new mongoose.model("ConnectionRequestDB",connectionRequestScehma )


module.exports= connectionRequestModel