const User = require("../models/User");
const Recipe = require("../models/Recipe");
const cloudinary = require("../config/cloudinary");


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

exports.updateProfile = async (req, res) => {
    try {
        const { name, bio } = req.body;

        let updateData = { name, bio };

        // if image uploaded
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.avatar = result.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        res.json(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
