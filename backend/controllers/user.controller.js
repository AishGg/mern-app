import bcrypt from 'bcryptjs';
import User from '../models/user.models.js'
import Notification from '../models/notification.model.js'
import {v2 as cloudinary} from "cloudinary";

export const getUserProfile = async (req, res)=>{
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select("-password");
        if(!user) return res.status(404).json({error: "User not found0"});
        res.send(200).json(user);
    } catch (error) {
        console.log("error in getUserProfile: ", error.message);
        res.status(500).json({error: error.message})
    }
}

export const followUnfollowuser = async (req, res)=>{

    try {
        const {id} =req.params;
        const userToModify = await User.findById(id);
        const currentuser = await User.findById(req.user._id);

        if(id== req.user._id.toString()){
            return res.status(400).json({error: "you can't follow/unfollow yourself"})
        }
        if(!userToModify || !currentuser) return res.status(400).json({error: "user not found"});

        const isFollowing = currentuser.following.includes(id);

        if(isFollowing){
            // unfollow the user
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            res.status(200).json({message: "user unfollowed successfully"});

        }
        else{
            // follow the user
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});

            //send the notification to the user
            const newNotification = new Notification({
                    type: "follow",
                    from: req.user._id,
                    to: userToModify._id,
            });

            await newNotification.save();

            res.status(200).json({message: "user followed successfully"});
        }

    } catch (error) {
        console.log("Error in followUnfollowUser: ", error.message);
        res.status(500).json({error: error.message})
    }
}

export const getSuggestedProfile  = async (req, res) =>{
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne: userId},
                },
            },
            { $sample: {size: 10} },
        ]);
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0,4);

        suggestedUsers.forEach((user)=> (user.password = null));
        res.status(200).json(suggestedUsers);

    
    
    
    }catch (error) {
        console.log("error in getsuggestedUsers: ", error.message);
        res.status(500).json({error: error.message})
    }
}

export const updateUser = async (req, res)=>{

    const {fullname, email, username, currentPassword, newPassword, bio ,link} = req.body;
    const {porfileImg, coverImg} = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).josn({message: "user not found"})
        
        if((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({error: "please provide both current and new password"})
        }
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch) return res.status(400).json({error: "current passwor dis incorrect"});
            if(newPassword.length < 6){
                return res.status(400).json({error: "Password must be at least 6 characters"})
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt)
        }

        if(porfileImg){
            if(user.porfileImg){
                await cloudinary.uploader.destroy(user.porfileImg.split("/").pop().split(".")[0]);

            }
            const uploadResponse = await cloudinary.uploader.upload(porfileImg)
            porfileImg = uploadResponse.secure_url;

        }

        if(coverImg){
            await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            const uploadResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadResponse.secure_url;
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;  
        user.porfileImg = porfileImg  || user.porfileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;
        
        return res.status(200).json(user);
        

    } catch (error) {
        console.log("error in updateuser", error.message);
        res.status(500).json({error: error.message})
    }
}

