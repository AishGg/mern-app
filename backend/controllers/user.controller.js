import User from '../models/user.models.js'

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

        if(id== req.user._id){
            return res.status(400).json({error: "you can't follow/unfollow yourself"})
        }
        if(!userToModify || !currentuser) return res.status(400).json({error: "user not found"});

        const isFollowing = currentuser.following.includes(id);
        if(isFollowing){
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            res.status(200).json({message: "user unfollowed successfully"});

        }
        else{
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            res.status(200).json({message: "user followed successfully"});
        }

    } catch (error) {
        console.log("Error in followUnfollowUser: ", error.message);
        res.status(500).json({error: error.message})
    }
}

