const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({

title: {
    type: String,
    required: true
},

description: {
    type: String
},

ingredients: [
    {
        name: String,
        quantity: String,
        unit: String
    }
],

instructions: [
    {
        type: String
    }
],

cookingTime: {
    type: Number
},

difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"]
},

image: {
    type: String
},

author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

ratings: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        rating: Number
    }
],

avgRating: {
    type: Number,
    default: 0
},

comments: [
    {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
        text: String,
        createdAt: {
        type: Date,
        default: Date.now
        }
    }
    ]

}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);