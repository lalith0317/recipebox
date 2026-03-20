import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditRecipe() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");

    // ================= FETCH RECIPE =================
    useEffect(() => {
        const fetchRecipe = async () => {
        const res = await API.get(`/recipes/${id}`);
        setRecipe(res.data);
        };
        fetchRecipe();
    }, [id]);

    // ================= IMAGE HANDLER =================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        if (file) {
        setPreview(URL.createObjectURL(file));
        }
    };

    // ================= UPDATE =================
    const handleUpdate = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        // update text data
        await API.put(`/recipes/${id}`, {
        ...recipe,
        userId: user._id
        });

        // upload new image if exists
        if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        await API.put(`/recipes/${id}/image`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        }

        alert("Recipe updated successfully 🎉");

        navigate(`/recipe/${id}`);
    };

    // ================= INGREDIENTS =================
    const handleIngredientChange = (i, field, value) => {
        const updated = [...recipe.ingredients];
        updated[i][field] = value;
        setRecipe({ ...recipe, ingredients: updated });
    };

    const addIngredient = () => {
        setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, { name: "", quantity: "", unit: "" }]
        });
    };

    const removeIngredient = (i) => {
        const updated = recipe.ingredients.filter((_, index) => index !== i);
        setRecipe({ ...recipe, ingredients: updated });
    };

    // ================= STEPS =================
    const handleStepChange = (i, value) => {
        const updated = [...recipe.instructions];
        updated[i] = value;
        setRecipe({ ...recipe, instructions: updated });
    };

    const addStep = () => {
        setRecipe({
        ...recipe,
        instructions: [...recipe.instructions, ""]
        });
    };

    const removeStep = (i) => {
        const updated = recipe.instructions.filter((_, index) => index !== i);
        setRecipe({ ...recipe, instructions: updated });
    };

    if (!recipe) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

    return (

        <div style={pageStyle}>

        <div style={cardStyle}>

            <h2 style={titleStyle}>✏ Edit Recipe</h2>

            <form onSubmit={handleUpdate}>

            {/* IMAGE SECTION */}
            <div style={sectionStyle}>
                <h3>Recipe Image</h3>

                <img
                src={preview || recipe.image}
                alt="preview"
                style={imagePreview}
                />

                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginTop: "10px" }}
                />
            </div>

            {/* BASIC INFO */}
            <div style={sectionStyle}>
                <h3>Basic Info</h3>

                <input
                value={recipe.title}
                onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                placeholder="Recipe Title"
                style={inputStyle}
                />

                <textarea
                value={recipe.description}
                onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
                placeholder="Description"
                style={inputStyle}
                />

                <input
                type="number"
                value={recipe.cookingTime}
                onChange={(e) => setRecipe({ ...recipe, cookingTime: e.target.value })}
                placeholder="Cooking Time"
                style={inputStyle}
                />

                <select
                value={recipe.difficulty}
                onChange={(e) => setRecipe({ ...recipe, difficulty: e.target.value })}
                style={inputStyle}
                >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                </select>
            </div>

            {/* INGREDIENTS */}
            <div style={sectionStyle}>
                <h3>Ingredients</h3>

                {recipe.ingredients.map((item, i) => (
                <div key={i} style={rowStyle}>

                    <input
                    value={item.name}
                    onChange={(e) => handleIngredientChange(i, "name", e.target.value)}
                    placeholder="Name"
                    style={smallInput}
                    />

                    <input
                    value={item.quantity}
                    onChange={(e) => handleIngredientChange(i, "quantity", e.target.value)}
                    placeholder="Qty"
                    style={smallInput}
                    />

                    <input
                    value={item.unit}
                    onChange={(e) => handleIngredientChange(i, "unit", e.target.value)}
                    placeholder="Unit"
                    style={smallInput}
                    />

                    <button type="button" onClick={() => removeIngredient(i)} style={deleteBtn}>
                    ✕
                    </button>

                </div>
                ))}

                <button type="button" onClick={addIngredient} style={addBtn}>
                + Add Ingredient
                </button>
            </div>

            {/* INSTRUCTIONS */}
            <div style={sectionStyle}>
                <h3>Instructions</h3>

                {recipe.instructions.map((step, i) => (
                <div key={i} style={rowStyle}>

                    <textarea
                    value={step}
                    onChange={(e) => handleStepChange(i, e.target.value)}
                    placeholder={`Step ${i + 1}`}
                    style={inputStyle}
                    />

                    <button type="button" onClick={() => removeStep(i)} style={deleteBtn}>
                    ✕
                    </button>

                </div>
                ))}

                <button type="button" onClick={addStep} style={addBtn}>
                + Add Step
                </button>
            </div>

            <button type="submit" style={submitBtn}>
                Update Recipe
            </button>

            </form>

        </div>

        </div>
    );
}



const pageStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f7f7f7",
    minHeight: "100vh"
};

const cardStyle = {
    width: "700px",
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
};

const titleStyle = {
    marginBottom: "20px"
};

const sectionStyle = {
    marginBottom: "25px"
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd"
};

const smallInput = {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ddd"
};

const rowStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "10px"
};

const addBtn = {
    marginTop: "10px",
    background: "#ff6b3d",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer"
};

const deleteBtn = {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer"
};

const submitBtn = {
    width: "100%",
    padding: "12px",
    background: "#ff6b3d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
};

const imagePreview = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginTop: "10px"
};

export default EditRecipe;