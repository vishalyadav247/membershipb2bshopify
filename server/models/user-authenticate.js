const mongoose = require("mongoose");
const {Schema} = mongoose;

const userAuthSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const UserAuthDb = mongoose.model("UserAuthDb", userAuthSchema);
module.exports = UserAuthDb;