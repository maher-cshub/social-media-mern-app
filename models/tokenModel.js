const mongoose = require("mongoose");


const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref: 'User'
    }
})

const Token = mongoose.model("Token",tokenSchema);
module.exports = Token;