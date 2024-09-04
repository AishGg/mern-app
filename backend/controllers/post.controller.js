import Post from '../models/post.models.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/user.models.js'

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found" });

        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or image" });

        }
        if (img) {
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        res.status(200).json(newPost);


    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in createPost controller: ", error)
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) return res.status(400).json({ message: "Post not found" });


        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "you are not allowed to delete this post"})
        }

        if (post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);

        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "your post is deleted successfully"})

    } catch (error) {
        console.log("error in deletePost controller ", error);
        res.status(500).json({error: "internal server error"})
    }
}