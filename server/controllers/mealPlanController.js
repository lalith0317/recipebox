const MealPlan = require("../models/MealPlan");

exports.addMeal = async (req, res) => {

try {

    const { userId, day, recipeId } = req.body;

    const meal = new MealPlan({
        user: userId,
        day,
        recipe: recipeId
    });

    await meal.save();

    res.json(meal);

} catch (error) {
    res.status(500).json({ error: error.message });
}

};


exports.getMealPlan = async (req, res) => {

try {

    const meals = await MealPlan.find({
        user: req.params.userId
    }).populate("recipe");

    res.json(meals);

} catch (error) {
    res.status(500).json({ error: error.message });
}

};