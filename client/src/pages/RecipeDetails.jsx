import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function RecipeDetails() {

    const { id } = useParams();

    const [recipe, setRecipe] = useState(null);
    const [comment, setComment] = useState("");
    const [userRating, setUserRating] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {

        const fetchRecipe = async () => {

            try {
                const res = await API.get(`/recipes/${id}`);
                setRecipe(res.data);
            } catch (error) {
                console.error(error);
            }

        };

        fetchRecipe();

    }, [id]);


    if (!recipe) {
        return <h2 style={{ textAlign: "center" }}>Loading Recipe...</h2>;
    }


    const isOwner = currentUser?._id === recipe.author?._id;



    const addComment = async () => {

        if (!comment.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        try {

            await API.post(`/recipes/${recipe._id}/comment`, {
                text: comment,
                userId: currentUser._id
            });

            setRecipe({
                ...recipe,
                comments: [...(recipe.comments || []), { text: comment, user: currentUser }]
            });

            setComment("");

        } catch (error) {
            console.error(error);
        }

    };



    const rateRecipe = async (value) => {

        if (!currentUser) {
            alert("Please login to rate");
            return;
        }

        try {

            const res = await API.post(`/recipes/${recipe._id}/rate`, {
                rating: value,
                userId: currentUser._id
            });

            setRecipe(res.data);
            setUserRating(value);

        } catch (error) {

            console.error(error);

            const msg = error.response?.data?.message;

            if (msg) {
                alert(msg);
            } else {
                alert("Failed to submit rating");
            }

        }
    };



    return (

        <div style={{ maxWidth: "800px", margin: "40px auto" }}>

            <img
                src={recipe.image || "https://via.placeholder.com/600"}
                alt={recipe.title}
                style={{
                    width: "400px",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    display: "block",
                    margin: "0 auto"
                }}
            />

            <h1>{recipe.title}</h1>

            {isOwner && (
                <button style={editBtn}>
                    Edit Recipe
                </button>
            )}

            <p style={{ color: "#777" }}>
                By {recipe.author?.name}
            </p>

            <p>⭐ {recipe.avgRating || "0"} / 5</p>

            <p>⏱ {recipe.cookingTime || "N/A"} minutes</p>

            <p>🔥 {recipe.difficulty}</p>

            <h3>Description</h3>
            <p>{recipe.description}</p>

            <h3>Ingredients</h3>

            <ul>
                {recipe.ingredients?.map((item, index) => (
                    <li key={index}>
                        {item.name} {item.quantity} {item.unit}
                    </li>
                ))}
            </ul>

            <h3>Instructions</h3>

            <ol>
                {recipe.instructions?.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>

            <h3>Rate this recipe</h3>

            <div style={{ marginTop: "10px" }}>

                {[1,2,3,4,5].map(star => (

                    <span
                        key={star}
                        onClick={() => {
                            if (!isOwner) rateRecipe(star);
                        }}
                        style={{
                            cursor: isOwner ? "not-allowed" : "pointer",
                            fontSize: "28px",
                            color: star <= (recipe.avgRating || 0) ? "gold" : "#ccc",
                            opacity: isOwner ? 0.5 : 1
                        }}
                    >
                        ★
                    </span>

                ))}

            </div>


            {isOwner && (
                <p style={{ color: "red", marginTop: "10px" }}>
                    You cannot rate your own recipe
                </p>
            )}

            <h3 style={{ marginTop: "30px" }}>Comments</h3>

            {recipe.comments?.map((c, index) => (
                <div key={index} style={commentStyle}>
                    <p style={{ fontWeight: "bold" }}>
                        {c.user?.name || "User"}
                    </p>
                    <p>{c.text}</p>
                </div>
            ))}

            <textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                style={textareaStyle}
            />

            <button onClick={addComment} style={btnStyle}>
                Post Comment
            </button>

            <button
                onClick={async () => {

                    const user = JSON.parse(localStorage.getItem("user"));

                    const res = await API.post(`/recipes/${recipe._id}/save`, {
                    userId: user._id
                    });

                    if (res.data.message === "Saved recipe") {
                    setIsSaved(true);
                    } else {
                    setIsSaved(false);
                    }

                }}
                style={{
                    ...saveBtnStyle,
                    background: isSaved ? "#28a745" : "#ff6b3d"  // green when saved
                }}
                >
                {isSaved ? "✔ Saved" : "❤️ Save Recipe"}
            </button>
        </div>
    );
}


const editBtn = {
    marginTop: "10px",
    padding: "8px 15px",
    background: "#ff6b3d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
};

const commentStyle = {
    borderBottom: "1px solid #ddd",
    padding: "10px 0"
};

const textareaStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd"
};

const btnStyle = {
    marginTop: "10px",
    padding: "10px 20px",
    background: "#ff6b3d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
};

const saveBtnStyle = {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#ff6b3d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s"
};

export default RecipeDetails;