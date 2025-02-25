import mongoose from "mongoose"; 
const userSchema = new mongoose.Schema({
  fullname :{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber:{
    type:String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role:{
    type:String,
    enum:['Student', 'Recruiter'],
    default:'Student',
    required: true
  },
  profile:{
    bio:{
      type: String,
      default: 'No bio provided'

    },
    skills:[{
      type: String
    }],
    resume:{
      type: String //URL to resume file
    },
    resumeOriginalname:{
      type: String //Original name of resume file
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    profilePhoto: {
      type: String, //URL to profile photo file
      default: "",
    }
  }
},{timestamps: true});

export const User = mongoose.model("User", userSchema);