import { useState } from "react";
import API from "../services/api";

function RecipeCard({ recipe }) {

    const [selectedRating, setSelectedRating] = useState(0);
    const [comment, setComment] = useState("");

    const rateRecipe = async (rating) => {
        try {
            await API.post(`/recipes/${recipe._id}/rate`, { rating });
            setSelectedRating(rating);
            window.location.reload();
        } catch (error) {
            console.error("Rating failed", error);
        }
    };

    const addComment = async () => {
    try {
        await API.post(`/recipes/${recipe._id}/comment`, { text: comment });
        setComment("");
        window.location.reload();
    } catch (error) {
        console.error("Comment failed", error);
    }
};

const followUser = async (targetUserId) => {

    const currentUserId = "YOUR_USER_ID";

    try {
        await API.post(`/users/${targetUserId}/follow`, {
            userId: currentUserId
        });

    alert("User followed");

} catch (error) {
    console.error(error);
}

};

return (
    <div style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "10px",
        width: "250px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    }}>

    <img
        src={recipe.image || "https://via.placeholder.com/300x200?text=Recipe"}
        alt={recipe.title}
        style={{ width: "100%", borderRadius: "8px" }}
    />

        <h3>{recipe.title}</h3>

        <p><strong>Description:</strong> {recipe.description}</p>

        <p><strong>Average Rating:</strong> ⭐ {recipe.avgRating || "0"} / 5</p>

        <p>⏱ {recipe.cookingTime || "N/A"} mins</p>

        <p>🔥 {recipe.difficulty}</p>

        <p><strong>Ingredients:</strong></p>

    <ul>
        {recipe.ingredients && recipe.ingredients.map((item, index) => (
            <li key={index}>
                {item.name} ({item.quantity} {item.unit})
            </li>
        ))}
    </ul>

    <p><strong>Rate this recipe:</strong></p>

    <div style={{ fontSize: "22px", cursor: "pointer" }}>
        {[1,2,3,4,5].map((star) => (
            <span
                key={star}
                onClick={() => rateRecipe(star)}
            >
                {star <= selectedRating ? "⭐" : "☆"}
            </span>
        ))}
    </div>

<p><strong>Comments:</strong></p>

<ul>
    {recipe.comments && recipe.comments.map((c, index) => (
        <li key={index}>{c.text}</li>
    ))}
</ul>

<input
    type="text"
    placeholder="Write a comment..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
/>

<button onClick={addComment}>
    Add Comment
</button>

<button onClick={() => followUser(recipe.author)}>
Follow Author
</button>
    </div>
);
}

export default RecipeCard;