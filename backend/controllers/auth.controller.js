import User from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import { genrateTokenAndSetCookie } from '../lib/utils/genrateToken.js';


export const signup = async(req, res)=>{
   try {
     const {username, fullname, email, password} = req.body;

      
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if(!emailRegex.test(email)){
      return res.status(400).json({error: "Invalid email format"})
     }
     const existingUser = await User.findOne({username})

     if (existingUser){
        return res.status(400).json({error: "Username is already taken"})
     }
     const existingEmail = await User.findOne({username})

     if (existingEmail){
        return res.status(400).json({error: "Email is already taken"})
     }
     
     // hash password
     const salt = await bcrypt.genSalt(10);
     const hashedpassword = await bcrypt.hash(password, salt);

     const newUser = new User({
      fullname,
      username,
      email,
      password: hashedpassword
     })

     if (newUser){
      genrateTokenAndSetCookie(newUser.id, res)
      await newUser.save()

      res.status(201).json({
         _id: newUser.id,
         fullname: newUser.fullname,
         email: newUser.email,
         username: newUser.username,
      });

      }
      else{
         res.status(400).json({error: "Invalid user data"})
      }
     
   } catch (error) {
      console.log(error.message)
      res.status(500).json({error: "Internal server error"})
   }
}
export const signin = async(req, res)=>{
    try {
      const {username, password} = req.body;
      const user = await User.findOne({username});
      const isPasswordValid = await bcrypt.compare(password, user?.password || "");

      if (!user || !isPasswordValid){
         res.status(400).json({error: "Invalid username or password"})
      }
      genrateTokenAndSetCookie(user.id, res)
      res.status(200).json({
         _id: user.id,
         fullname: user.fullname,
         email: user.email,
         username: user.username,
      });
    } catch (error) {
         console.log(error.message)
         res.status(500).json({error: "Internal server error"});
    }
}
export const signout = async(req, res)=>{
   try{
      res.cookie("jwt", "",{maxAge: 0})
      res.status(200).json({message: "Signout successfully"});
   }
   catch (error) {
      console.log(error.message);
      res.status(500).json({error: "Internal server error"});
 }
}
export const getMe = async(req, res)=>{
   try {
      const user = await User.findById(req.user._id).select("-password");
      res.status(200).json(user);
   } catch (error) {
      console.log("error in getMe Middleware",error.message);
      res.status(500).json({error: "Internal server error"});
   }
}