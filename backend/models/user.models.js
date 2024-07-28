import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        typpe: String,
        require: true,
        unique: true
    },
    fullname:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true,
        minLength: 6
    },
    email:{
        type: String,
        require: true,
    }
},{timestamps: true})

const User = new mongoose.model("User", userSchema)
export default User;