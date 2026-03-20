const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/mealplan", mealPlanRoutes);
app.use("/api/users",userRoutes);

app.get("/", (req, res) => {
    res.send("RecipeBox API Running");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err);
});