import Post from '../models/post.models.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/user.models.js'
import Notification from '../models/notification.model.js'

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


        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "you are not allowed to delete this post" })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);

        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "your post is deleted successfully" })

    } catch (error) {
        console.log("error in deletePost controller ", error);
        res.status(500).json({ error: "internal server error" })
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId)

        if (!text) { return res.status(400).json({ message: "text is required" }) }

        if (!post) { return res.status(400).json({ message: "post not found" }) }

        const comment = { user: userId, text };
        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);

    } catch (error) {
        console.log("error in coomentOnPost controller", error);
        res.status(500).json({ error: "internal server error" });
    }
}

export const likeUnlikePost = async (req, res) => {

    try {
        
        const userId = req.body._id;
        const postId = req.params.id;

        const post = Post.findById(postId);

        if (!post) { return res.status(400).json({ message: "post not found" }) }

        const userLikedPost = post.likes.includes(userId)

        if (userLikedPost){
            // unlike the post

            await Post.updateOne({postId}, {$pull: {likes: userId}});
            res.status(200).json({message: "post is unliked successfully"})

        }
        else{

            post.likes.push(userId);
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })

            await notification.save(); 
            res.status(200).json({message: "post is liked successfully"})
        }
        
    } catch (error) {
        console.log("error in likeUnlikePost controller", error);
        res.status(500).json({ error: "internal server error" });
    }
}