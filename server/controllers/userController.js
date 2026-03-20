const User = require("../models/User");
const Recipe = require("../models/Recipe");


exports.followUser = async (req, res) => {

    try {

        const currentUserId = req.body.userId;
        const targetUserId = req.params.id;

        // 🚫 prevent self-follow
        if (currentUserId === targetUserId) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        });
        }

        const user = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        const isFollowing = user.following.includes(targetUserId);

        if (isFollowing) {

        user.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);

        await user.save();
        await targetUser.save();

        return res.json({ message: "Unfollowed" });

        } else {

        user.following.push(targetUserId);
        targetUser.followers.push(currentUserId);

        await user.save();
        await targetUser.save();

        return res.json({ message: "Followed" });

        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

exports.getUserProfile = async (req,res)=>{

    try{

        const user = await User.findById(req.params.id).populate("savedRecipes");

        const recipes = await Recipe.find({
            author:req.params.id
        });

        res.json({
            user,
            recipes,
            savedRecipes: user.savedRecipes
        });

    }catch(error){

        res.status(500).json({error:error.message});

    }

};
