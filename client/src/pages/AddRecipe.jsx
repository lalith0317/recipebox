import { useState } from "react";
import { useDropzone } from "react-dropzone";
import API from "../services/api";

function AddRecipe() {

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [ingredients,setIngredients] = useState("");
    const [instructions,setInstructions] = useState("");
    const [cookingTime,setCookingTime] = useState("");
    const [difficulty,setDifficulty] = useState("Easy");
    const [image,setImage] = useState(null);

    const onDrop = (files)=>{
        setImage(files[0]);
    };

    const {getRootProps,getInputProps} = useDropzone({onDrop});

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const formData = new FormData();

        formData.append("title",title);
        formData.append("description",description);
        formData.append("cookingTime",cookingTime);
        formData.append("difficulty",difficulty);
        formData.append("author","YOUR_USER_ID");

        formData.append(
        "ingredients",
        JSON.stringify(
            ingredients.split("\n").map(i=>({
            name:i,
            quantity:"",
            unit:""
            }))
        )
        );

        formData.append(
        "instructions",
        JSON.stringify(instructions.split("\n"))
        );

        if(image){
        formData.append("image",image);
        }

        await API.post("/recipes",formData);

        alert("Recipe Created!");
    };

    return (

    <div style={{
        maxWidth:"800px",
        margin:"40px auto",
        padding:"30px",
        borderRadius:"10px",
        boxShadow:"0 4px 12px rgba(0,0,0,0.1)",
        background:"#fff"
    }}>

        <h1 style={{
        textAlign:"center",
        marginBottom:"30px"
        }}>
        Create New Recipe
        </h1>

        <form onSubmit={handleSubmit}>

        <label>Recipe Title</label>
        <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Enter recipe title"
            style={inputStyle}
        />

        <label>Description</label>
        <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="Describe your recipe"
            style={textareaStyle}
        />

        <label>Ingredients (one per line)</label>
        <textarea
            value={ingredients}
            onChange={(e)=>setIngredients(e.target.value)}
            placeholder="Chicken\nRice\nSoy Sauce"
            style={textareaStyle}
        />

        <label>Instructions (steps)</label>
        <textarea
            value={instructions}
            onChange={(e)=>setInstructions(e.target.value)}
            placeholder="Step 1\nStep 2\nStep 3"
            style={textareaStyle}
        />

        <div style={{display:"flex",gap:"20px"}}>

            <div style={{flex:1}}>
            <label>Cooking Time (minutes)</label>
            <input
                type="number"
                value={cookingTime}
                onChange={(e)=>setCookingTime(e.target.value)}
                style={inputStyle}
            />
            </div>

            <div style={{flex:1}}>
            <label>Difficulty</label>
            <select
                value={difficulty}
                onChange={(e)=>setDifficulty(e.target.value)}
                style={inputStyle}
            >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
            </select>
            </div>

        </div>

        <label style={{marginTop:"20px"}}>Recipe Image</label>

        <div
            {...getRootProps()}
            style={{
            border:"2px dashed #ccc",
            padding:"30px",
            textAlign:"center",
            marginTop:"10px",
            borderRadius:"10px",
            cursor:"pointer"
            }}
        >

            <input {...getInputProps()} />

            {image ? (
            <p>{image.name}</p>
            ) : (
            <p>Drag & Drop Image or Click to Upload</p>
            )}

        </div>

        <button
            type="submit"
            style={{
            marginTop:"25px",
            width:"100%",
            padding:"12px",
            background:"#ff6b3d",
            color:"#fff",
            border:"none",
            borderRadius:"8px",
            fontSize:"16px",
            cursor:"pointer"
            }}
        >
            Publish Recipe
        </button>

        </form>

    </div>

    );
}

const inputStyle={
    width:"100%",
    padding:"10px",
    margin:"10px 0 20px",
    borderRadius:"6px",
    border:"1px solid #ccc"
};

const textareaStyle={
    width:"100%",
    padding:"10px",
    height:"80px",
    margin:"10px 0 20px",
    borderRadius:"6px",
    border:"1px solid #ccc"
};

export default AddRecipe;