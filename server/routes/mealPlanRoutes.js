const express = require("express");
const router = express.Router();

const { addMeal, getMealPlan } = require("../controllers/mealPlanController");

router.post("/", addMeal);

router.get("/:userId", getMealPlan);

module.exports = router;