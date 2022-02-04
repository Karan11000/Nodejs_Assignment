const express = require("express");
const app = express();
const mongoose = require("mongoose")
const student = require("./models/studentModal")
const validator = require("email-validator")
const validatePhoneNumber = require('validate-phone-number-node-js');
const jwt = require("jsonwebtoken");
const {protect} = require("./middleware/userAuth");
const dotenv = require("dotenv")
dotenv.config();



mongoose.connect("mongodb+srv://karan:Karan1234@cluster0.8jj4i.mongodb.net/studentdata?retryWrites=true&w=majority")
.then(()=>{
    console.log("succesfully connected");
}).catch((err)=>{
    console.log(err);
})
const user = mongoose.model("users", {name:{type: String, unique: true}});
app.use(express.json());

app.get("/", async (req, res)=>{
    const result = await user.find({});
    const id = result._id;
    console.log(result);
    res.json({
        result, 
        token : jwt.sign({id}, "karan")
    })
})
app.get('/api', protect,  async (req, res)=>{  
    const results = await student.find({});
    res.send(results);
})
 
app.post('/api',protect,  async (req, res)=>{
      const {name, email, mobile} = req.body;
      console.log(name, email, mobile);
      if(!name || !email || !mobile){
          throw new Error("Enter all the fields");
      }
      for(let i = 0; i<name.length; i++){
          if(!((name[i]>= 'a' && name[i]<='z')||(name[i]>='A' && name[i]<='Z'))){
              throw new Error("Enter a Valid Name");
          }
      }
      if(!validator.validate(email)){
          throw new Error("Invalid Email");
        }
    if(!validatePhoneNumber.validate(mobile)){
        throw new Error("Enter a valid Phone Number");   
    }
      await student.create({name: name, email: email, mobile:mobile});
      res.redirect('/api');
})

app.put('/api', protect,  async (req, res)=>{
    const {studentId, studentUpdate} = req.body;
    console.log(studentId, studentUpdate);
    if(!studentId){
         throw new Error("Enter the id of the student which you want to update");     
    }
    const {name : nameUpdate , email : emailUpdate, mobile : mobileUpdate} = studentUpdate;
    console.log(nameUpdate, emailUpdate, mobileUpdate);
    const result = await student.findById(studentId);
    const update = await student.findByIdAndUpdate(
        studentId,
        {
            name: nameUpdate?nameUpdate:result.name,
            email : emailUpdate?emailUpdate:result.email,
            mobile : mobileUpdate?mobileUpdate:result.mobile
        },
        {
            new:true
        }
    )
    if(!update){
        res.status(400);
        throw new Error("Unable to update the student record");
    }else{
        res.redirect("/api");
    }
})


app.delete('/api',protect,  async (req, res)=>{
    const {studentId} = req.body;
    if(!studentId){
        throw new Error("Enter the id of the student which you want to delete");    
    }
    console.log(studentId)
    await student.findOneAndDelete({ _id : studentId})
    res.redirect('/api');
})

app.listen(5000);