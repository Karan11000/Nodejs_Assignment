const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique : true
    },
    mobile:{
        type:Number,
        required:true,
        unique: true
    }
})

module.exports = mongoose.model("student", studentSchema);