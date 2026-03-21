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

        const res = await API.get("/recipes", {
            params: {
            search,
            difficulty,
            maxTime,
            ingredient
            }
        });

        setRecipes(res.data);
    };

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.ingredients?.some(i =>
            i.name.toLowerCase().includes(search.toLowerCase())
        )
    );

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

            <div style={{
                display:"flex",
                gap:"10px",
                flexWrap:"wrap",
                marginBottom:"20px"
            }}>

                <input
                    placeholder="🔍 Search..."
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />

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

                {loading && (
                    <p style={{ textAlign: "center" }}>Loading recipes...</p>
                )}

                <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
                    Explore Recipes
                </h2>

                <div style={gridStyle}>

                    {filteredRecipes.map(recipe => (

                        <div key={recipe._id} style={cardStyle}>

                            {/* CLICKABLE CARD */}
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

                                    {/* SAFE AUTHOR */}
                                    <p style={{ color: "#666" }}>
                                        By{" "}
                                        {recipe.author ? (
                                            <span
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    window.location.href = `/profile/${recipe.author._id}`;
                                                }}
                                                style={{
                                                    color: "#ff6b3d",
                                                    cursor: "pointer",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {recipe.author.name}
                                            </span>
                                        ) : (
                                            "Unknown"
                                        )}
                                    </p>

                                    <p style={{ color: "#777", fontSize: "14px" }}>
                                        {recipe.description}
                                    </p>

                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "10px"
                                    }}>

                                        <span>⭐ {recipe.avgRating || "0"}</span>
                                        <span>⏱ {recipe.cookingTime || "N/A"} min</span>

                                    </div>

                                    <p style={{
                                        marginTop: "8px",
                                        fontWeight: "bold",
                                        color: "#ff6b3d"
                                    }}>
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
    transition: "transform 0.2s",
    cursor: "pointer"
};

const imageStyle = {
    width: "100%",
    height: "180px",
    objectFit: "cover"
};

export default Home;