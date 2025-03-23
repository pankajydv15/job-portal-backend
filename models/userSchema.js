const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{type:String, required: true},
    lastName:{type:String, required: true},
    email:{type:String , require:true , unique:true},
    password:{type:String , require:true},
    number:{type:String , require:true},

    role: { type: String,  enum: ["job-seeker", "job-poster", "Job Seeker", "Job Poster"], default: "Job Seeker" },

    bio:{ type: String },
    skills: { type: String },
    experience: { type: String },
    socialLinks: { type: String },
    portfolio: { type: String },
    location: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    currentJobTitle: { type: String },
    profilePic: { type: String },
    resume: { type: String },
}, {timestamps:true})

const User=mongoose.model('user',userSchema);

module.exports=User