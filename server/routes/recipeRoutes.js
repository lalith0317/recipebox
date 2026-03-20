const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");


const {
    createRecipe,
    getRecipes,
    getRecipeById,
    updateRecipeImage,
    updateRecipe,
    deleteRecipe,
    rateRecipe,
    addComment,
    getFeed,
    toggleSaveRecipe
} = require("../controllers/recipeController");

router.post("/", upload.single("image"), createRecipe);

router.get("/", getRecipes);

router.put("/:id/image", upload.single("image"), updateRecipeImage);

router.delete("/:id", deleteRecipe);

router.put("/:id", updateRecipe);

router.post("/:id/rate", rateRecipe);

router.post("/:id/comment", addComment);

router.get("/feed/:userId", getFeed);

router.get("/:id", getRecipeById);

router.post("/:id/save", toggleSaveRecipe);

module.exports = router;