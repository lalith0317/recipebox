import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Home() {

    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [difficulty, setDifficulty] = useState("");
    const [maxTime, setMaxTime] = useState("");
    const [ingredient, setIngredient] = useState("");

    useEffect(() => {
        fetchRecipes();
    }, [search, difficulty, maxTime, ingredient]);

    const fetchRecipes = async () => {
        setLoading(true);

        try {
            const res = await API.get("/recipes", {
                params: { search, difficulty, maxTime, ingredient }
            });

            setRecipes(res.data);

        } catch (err) {
            console.error(err);
            alert("Something went wrong 😓"); // ✅ error handling
        }

        setLoading(false);
    };

    return (

        <div>

            {/* HERO SECTION */}
            <div style={heroStyle}>

                <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
                    Discover Delicious Recipes
                </h1>

                <p style={{ marginBottom: "25px" }}>
                    Cook, Share and Explore amazing food ideas 🍳
                </p>

                <input
                    type="text"
                    placeholder="🔎 Search recipes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={searchStyle}
                />

            </div>

            {/* 🔥 FILTER BAR */}
            <div style={filterBarStyle}>

                <select onChange={(e)=>setDifficulty(e.target.value)}>
                    <option value="">All Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <input
                    type="number"
                    placeholder="⏱ Max Time"
                    onChange={(e)=>setMaxTime(e.target.value)}
                />

                <input
                    placeholder="🥦 Ingredient"
                    onChange={(e)=>setIngredient(e.target.value)}
                />

            </div>

            {/* RECIPES SECTION */}
            <div style={{ padding: "40px" }}>

                <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
                    Explore Recipes
                </h2>

                {/* ✅ LOADING */}
                {loading && (
                    <h3 style={{ textAlign: "center" }}>
                        Loading recipes... 🍳
                    </h3>
                )}

                {/* ❌ EMPTY STATE */}
                {!loading && recipes.length === 0 && (
                    <h3 style={{ textAlign: "center" }}>
                        No recipes found 😢 Try different filters
                    </h3>
                )}

                {/* 🍲 RECIPES */}
                <div style={gridStyle}>

                    {!loading && recipes.map(recipe => (

                        <div key={recipe._id} style={cardStyle}>

                            <Link
                                to={`/recipe/${recipe._id}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >

                                <img
                                    src={recipe.image || "https://via.placeholder.com/300"}
                                    alt={recipe.title}
                                    style={imageStyle}
                                />

                                <div style={{ padding: "15px" }}>

                                    <h3>{recipe.title}</h3>

                                    <p style={{ color: "#666" }}>
                                        By{" "}
                                        {recipe.author ? (
                                            <span
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    window.location.href = `/profile/${recipe.author._id}`;
                                                }}
                                                style={authorStyle}
                                            >
                                                {recipe.author.name}
                                            </span>
                                        ) : "Unknown"}
                                    </p>

                                    <p style={{ color: "#777", fontSize: "14px" }}>
                                        {recipe.description}
                                    </p>

                                    <div style={infoRowStyle}>
                                        <span>⭐ {recipe.avgRating || "0"}</span>
                                        <span>⏱ {recipe.cookingTime || "N/A"} min</span>
                                    </div>

                                    <p style={difficultyStyle}>
                                        🔥 {recipe.difficulty}
                                    </p>

                                </div>

                            </Link>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

const heroStyle = {
    background: "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1498837167922-ddd27525d352')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "300px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
};

const searchStyle = {
    padding: "12px",
    width: "300px",
    borderRadius: "25px",
    border: "none",
    outline: "none",
    fontSize: "14px"
};

const filterBarStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    padding: "20px",
    justifyContent: "center",
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
};

const cardStyle = {
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    cursor: "pointer"
};

const imageStyle = {
    width: "100%",
    height: "180px",
    objectFit: "cover"
};

const authorStyle = {
    color: "#ff6b3d",
    cursor: "pointer",
    fontWeight: "bold"
};

const infoRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
};

const difficultyStyle = {
    marginTop: "8px",
    fontWeight: "bold",
    color: "#ff6b3d"
};

export default Home;