import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Profile(){

    const {id} = useParams();

    const [user,setUser] = useState(null);
    const [recipes,setRecipes] = useState([]);
    const [isFollowing,setIsFollowing] = useState(false);
    const [savedRecipes, setSavedRecipes] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const isOwnProfile = currentUser?._id === id;

    useEffect(()=>{

        const fetchProfile = async()=>{

            const res = await API.get(`/users/${id}`);

            setUser(res.data.user);
            setRecipes(res.data.recipes);
            setSavedRecipes(res.data.savedRecipes);
        };

        fetchProfile();

    },[id]);

    if(!user){
        return <h2>Loading profile...</h2>;
    }

    return(

        <div style={{maxWidth:"900px",margin:"40px auto"}}>

            <h1>{user.name}</h1>

            <p>Followers: {user.followers.length}</p>
            <p>Following: {user.following.length}</p>

            {/* ✅ FOLLOW BUTTON ONLY FOR OTHER USERS */}
            {!isOwnProfile && (
                <button
                    onClick={async()=>{

                        const res = await API.post(`/users/${id}/follow`,{
                            userId:currentUser._id
                        });

                        if(res.data.message === "Followed"){
                            setIsFollowing(true);
                        }else{
                            setIsFollowing(false);
                        }

                    }}
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>
            )}

            <h2 style={{marginTop:"40px"}}>Recipes</h2>

            {recipes.map(recipe=>(

                <div key={recipe._id} style={{marginBottom:"15px"}}>

                    <h3>{recipe.title}</h3>

                    {/* ✅ OWNER CONTROLS */}
                    {isOwnProfile && (

                        <div style={{display:"flex", gap:"10px"}}>

                            <button
                                onClick={()=>window.location.href=`/edit/${recipe._id}`}
                                style={btnStyle}
                            >
                                ✏ Edit
                            </button>

                            <button
                                onClick={async () => {

                                    const user = JSON.parse(localStorage.getItem("user"));

                                    await API.delete(`/recipes/${recipe._id}`, {
                                        data: { userId: user._id }
                                    });

                                    setRecipes(prev => prev.filter(r => r._id !== recipe._id));

                                }}
                                style={{...btnStyle, background:"red"}}
                            >
                                🗑 Delete
                            </button>

                        </div>

                    )}

                </div>

            ))}

            <h2 style={{ marginTop: "40px" }}>Saved Recipes ❤️</h2>

                {savedRecipes.length === 0 ? (
                <p>No saved recipes yet</p>
                ) : (
                savedRecipes.map(recipe => (

                    <div key={recipe._id} style={cardStyle}>

                    <h3>{recipe.title}</h3>

                    <p style={{ color: "#666" }}>
                        ⭐ {recipe.avgRating || "0"}
                    </p>

                    <button
                        onClick={() => window.location.href = `/recipe/${recipe._id}`}
                        style={btnStyle}
                    >
                        View Recipe
                    </button>

                    </div>

                ))
            )}

        </div>

    );

}

const btnStyle = {
    padding:"5px 10px",
    background:"#ff6b3d",
    color:"white",
    border:"none",
    borderRadius:"5px",
    cursor:"pointer"
};

const cardStyle = {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px"
};

export default Profile;