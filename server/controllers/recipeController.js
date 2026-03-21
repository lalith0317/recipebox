const Recipe = require("../models/Recipe");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");



exports.createRecipe = async (req, res) => {
try {
    let imageUrl = "";

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    }

    const recipe = new Recipe({
        ...req.body,
        image: imageUrl,
        author: req.body.author
    });

    const savedRecipe = await recipe.save();

    res.status(201).json(savedRecipe);

} catch (error) {
    res.status(500).json({ error: error.message });
}
};


exports.getRecipes = async (req, res) => {
try {

    const { search, ingredient, maxTime, difficulty, exclude } = req.query;

    let query = {};

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    if (ingredient) {
        query["ingredients.name"] = { $regex: ingredient, $options: "i" };
    }

    if (exclude) {
        query["ingredients.name"] = {
            $not: { $regex: exclude, $options: "i" }
        };
    }

    if (maxTime) {
        query.cookingTime = { $lte: Number(maxTime) };
    }

    if (difficulty) {
        query.difficulty = difficulty;
    }

    const recipes = await Recipe.find(query).populate("author", "name");

    const recipesWithRating = recipes.map((recipe) => {

    const ratings = recipe.ratings || [];

    const avgRating =
        ratings.length === 0
            ? 0
            : ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

return {
        ...recipe.toObject(),
        avgRating: avgRating.toFixed(1)
    };

    });

    res.json(recipesWithRating);

} catch (error) {
    res.status(500).json({ error: error.message });
}
};

exports.updateRecipeImage = async (req, res) => {
try {

    const recipeId = req.params.id;

    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { image: result.secure_url },
        { new: true }
    );

    res.json(updatedRecipe);

} catch (error) {
    res.status(500).json({ error: error.message });
}
};


exports.updateRecipe = async (req, res) => {
    try {

        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
        }

        // 🔐 AUTH CHECK
        if (recipe.author.toString() !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized" });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );

        res.json(updatedRecipe);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.deleteRecipe = async (req, res) => {
    try {

        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
        }

        // 🔐 AUTH CHECK
        if (recipe.author.toString() !== req.body.userId) {
        return res.status(403).json({ message: "Not authorized" });
        }

        await recipe.deleteOne();

        res.json({ message: "Recipe deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.rateRecipe = async (req, res) => {
    try {

        const { rating, userId } = req.body;

        if (!rating || !userId) {
            return res.status(400).json({ message: "Rating and userId are required" });
        }

        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // 🚫 prevent self rating (SAFE CHECK)
        if (
            recipe.author &&
            recipe.author.toString() === userId
        ) {
        return res.status(400).json({
            message: "You cannot rate your own recipe"
        });
        }

        const existingRating = recipe.ratings.find(
        r => r.user && r.user.toString() === userId
        );

        if (existingRating) {
            existingRating.rating = rating;
        } else {
            recipe.ratings.push({
                user: userId,
                rating: rating
            });
        }

        const total = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);

        recipe.avgRating = total / recipe.ratings.length;

        await recipe.save();

        res.json(recipe);

    } catch (error) {

        console.error("Rating Error:", error);

        res.status(500).json({
        message: "Rating failed",
        error: error.message
        });

    }
};

exports.addComment = async (req,res)=>{

    try{

        const {text,userId} = req.body;

        const recipe = await Recipe.findById(req.params.id);

        if(!text || !text.trim()){
            return res.status(400).json({message:"Comment cannot be empty"});
        }
        else{recipe.comments.push({
        user:userId,
        text
        });}

        await recipe.save();

        res.json(recipe);

    }catch(error){
        res.status(500).json({error:error.message});
    }

};

exports.getFeed = async (req, res) => {

try {

    const userId = req.params.userId;

    const user = await User.findById(userId);

    const feedRecipes = await Recipe.find({
        author: { $in: user.following }
    }).populate("author", "name");

    res.json(feedRecipes);

} catch (error) {
    res.status(500).json({ error: error.message });
}

};

exports.getRecipeById = async (req,res)=>{

try{

    const recipe = await Recipe.findById(req.params.id);

    res.json(recipe);

}catch(error){

    res.status(500).json({error:error.message});

}

};

exports.searchRecipes = async (req, res) => {
    try {
        const { query, category } = req.query;

        const filter = {};

        if (query) {
            filter.title = { $regex: query, $options: "i" };
        }

        if (category) {
            filter.category = category;
        }

        const recipes = await Recipe.find(filter).populate("author", "username");

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleSaveRecipe = async (req, res) => {

    try {

        const { userId } = req.body;
        const recipeId = req.params.id;

        const user = await User.findById(userId);

        const alreadySaved = user.savedRecipes.includes(recipeId);

        if (alreadySaved) {
        user.savedRecipes.pull(recipeId);
        await user.save();
        return res.json({ message: "Removed from saved" });
        }

        user.savedRecipes.push(recipeId);
        await user.save();

        res.json({ message: "Saved recipe" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};