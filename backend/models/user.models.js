import mongoose, {mongo}from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    fullname:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    email:{
        type: String,
        required: true
    }
},{timestamps: true})

const User = new mongoose.model("User", userSchema)
export default User;