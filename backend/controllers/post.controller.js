import Post from '../models/post.models.js';
import {v2 as cloudinary} from 'cloudinary';
import User from '../models/user.models.js'

export const createPost = async (req, res)=>{
    try {
        const text = req.body;
        let {img} = req.body
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) return res.status(400).json({message: "User not found"});

        if(!text && !img){
            return res.status(400).json({error: "Post must have text or image"});

        }
        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            img,
        })

        await newPost.save();
        res.status(200).json(newPost);

        
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in createPost controller: ", error)
    }
}