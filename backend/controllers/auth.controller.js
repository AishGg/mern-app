import User from '../models/user.models.js'
import bcrypt from 'bcryptjs'

export const signup = async(req, res)=>{
   try {
     const {username, fullname, email, password} = req.body;

     const existingUser = await User.findOne({username})

     if (existingUser){
        return res.status(400).json({error: "Username is already taken"})
     }
     const existingEmail = await User.findOne({username})

     if (existingEmail){
        return res.status(400).json({error: "Email is already taken"})
     }
     
     // hash password
     const salt = await bcrypt.gensalt(10);
     const hashedpassword = await bcrypt.hash(password, salt);

     const newUser = new User({
      fullname,
      username,
      email,
      password: hashedpassword
     })

     if (newUser){
      genrateTokenandSetCookie(newUser.id, res)
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
        res.send(`error is found ${error.message}`)
   }
}
export const signin = async(req, res)=>{
    res.send("singin page is working")
}
export const signout = async(req, res)=>{
    res.send("singout page is working")
}