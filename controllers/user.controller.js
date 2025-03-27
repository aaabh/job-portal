import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  // Your registration logic here
  try{
    const {fullname , email, phoneNumber,password, role} =req.body;
    if(!fullname || !email || !phoneNumber || !password|| !role){
      return res.status(404).json({
        message: 'All fields are required',
        success: false,
      });
    }
    const user = await User.findOne({ email});
    if(user){
      return res.status(404).json({
        message: 'Email already exists',
         success: false
        });
    }
    //convert password to hashes
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname, 
      email, 
      phoneNumber, 
      password: hashedPassword, 
      role
    });
    //save user to database
    await newUser .save();

    return res.status(200).json({
      message: `Account created successfully ${fullname}`,
      success: true,
    });
  }
  catch(error){
    res.status(500).json({
      message: "Server error in registration: " + error.message,
      success: false,
    });
  }
}
export const login = async (req, res) => {
  // Your login logic here
  try {
    const {email, password, role} = req.body;
    if (!email || !password || !role) {
      return res.status(404).json({
        message: 'Missing required fields',
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user){
      return res.status(404).json({
        message: "Incorrect email or  password",
        success: false,
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(404).json({
        message: "Invalid password",
        success: false,
      });
    }
    //check role correctly or not
    if(user.role !== role){
      return res.status(403).json({
        message: "You don't have the necessary role to access this resource",
        success: false,
      });
    }
    //generate token
    const tokenData = {
      userId : user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user={
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res.status(200)
    .cookie("token",token, {
      maxAge: 1 * 24 * 60 * 60 * 60 * 1000,
      httpOnly: true,
      sameStatus: "Strict",  
    } ).json({
      message: `Welcome back ${user.fullname}`,
      user,
      success: true,
    })
  } catch ( error) {
    console.log(error);
    res.status(500).json({
      message: "Server error login failure: " + error.message,
      success: false,
    });
  }
}

//logout
export const logout = (req, res) => {
  try {
    return res.status(200)
    .cookie("token", "", {maxAge: 0})
    .json({
      message: "Logged out successfully",
      success: true,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error logout" + error.message,
      success: false,
    });
  }
}
// export const updateProfile = async (req, res) => {
//   try{
//     const {fullname, email, phoneNumber, bio, skills} = req.body;
//     const file = req.files;
// //cloudinary upload
     
//     let skillsArray; 
//     if(skills){
//        skillsArray = skills.split(',');
//     }
//     const userId = req.id;// middleware aythentication 
//     let user = await User.findById(userId);
//     if(!user){
//       return res.status(404).json({
//         message: "User not found",
//         success: false,
//       });
      
//     } 
//     //update database profile 
//     if(fullname){
//       user.fullname = fullname;
//     }
//     if(email){
//       user.email = email;
//     }
//     if(phoneNumber){
//       user.phoneNumber = phoneNumber;
//     }
//     if(bio){
//       user.profile.bio = bio;
//     }
//     if(skills){
//       user.profile.skills = skillsArray;
//     }
    




//     //resume
//     await user.save();

//     const updatedUser = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile:  user.profile,
//     }
//     return res.status(200)
//     .json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//       success: true,
//      });
//   }
//   catch(error){
//     console.log(error);
//     res.status(500).json({
//       message: "Server Error Updating Profile",
//       success: false,
//     })
    
//   }
// }



export const updateProfile = async (req, res) => {
  try{
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    // if(!fullname || !email || !phoneNumber || !bio || !skills){
    //   return res.status(404).json({
    //     message : "Missing required fields",
    //     success : false,
    //   });
    // }


    //cloudary upload
    let skillsArray;
    if(skills){
      const skrillArray = skills.split(',');
    }
    const userId = req.id; //middleware authentication
    let user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    //update database profile

    if(fullname){
      user.fullname = fullname;
    }
    if(email){
    user.email = email;
    }
    if(phoneNumber){
    user.phoneNumber = phoneNumber;
    }
    if(bio){
    user.profile.bio = bio;
    }
    if(skills){
    user.profile.skills = skrillArray;
    }
    //resume
     
    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: user
  });

  }
  catch(error){
    console.error(error);
    res.status(500).json({
      message: "Server Error Updating Profile",
      success: false,
    });
    

  }
}
