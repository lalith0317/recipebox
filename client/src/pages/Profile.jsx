import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function Profile() {

    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const isOwnProfile = currentUser?._id === id;

    // 🔥 FETCH PROFILE
    useEffect(() => {
        const fetchProfile = async () => {

            const res = await API.get(`/users/${id}`);

            setUser(res.data.user);
            setRecipes(res.data.recipes);
            setSavedRecipes(res.data.savedRecipes || []);

            // check following
            if (currentUser) {
                setIsFollowing(
                    res.data.user.followers.includes(currentUser._id)
                );
            }
        };

        fetchProfile();
    }, [id]);

    // 🔥 SET FORM DATA
    useEffect(() => {
        if (user) {
            setName(user.name);
            setBio(user.bio || "");
        }
    }, [user]);

    if (!user) {
        return <h2 style={{ textAlign: "center" }}>Loading profile...</h2>;
    }

    return (

        <div style={{ maxWidth: "900px", margin: "40px auto" }}>

            {/* PROFILE HEADER */}
            <div style={{ textAlign: "center" }}>

                <img
                    src={user.avatar || "https://via.placeholder.com/120"}
                    alt="avatar"
                    style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        objectFit: "cover"
                    }}
                />

                <h1>{user.name}</h1>

                <p style={{ color: "#666" }}>
                    {user.bio || "No bio yet"}
                </p>

                <p>Followers: {user.followers.length}</p>
                <p>Following: {user.following.length}</p>

                {/* FOLLOW BUTTON */}
                {!isOwnProfile && (
                    <button
                        onClick={async () => {

                            const res = await API.post(`/users/${id}/follow`, {
                                userId: currentUser._id
                            });

                            setIsFollowing(res.data.message === "Followed");

                        }}
                        style={btnStyle}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                )}

                {/* EDIT BUTTON */}
                {isOwnProfile && (
                    <button
                        onClick={() => setEditing(!editing)}
                        style={{ ...btnStyle, marginTop: "10px" }}
                    >
                        {editing ? "Cancel" : "Edit Profile"}
                    </button>
                )}

            </div>

            {/* EDIT FORM */}
            {editing && (
                <div style={{ marginTop: "20px" }}>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        style={inputStyle}
                    />

                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Bio"
                        style={inputStyle}
                    />

                    <input
                        type="file"
                        onChange={(e) => setAvatar(e.target.files[0])}
                    />

                    <button
                        onClick={async () => {

                            const formData = new FormData();
                            formData.append("name", name);
                            formData.append("bio", bio);
                            if (avatar) formData.append("avatar", avatar);

                            const res = await API.put(`/users/${user._id}`, formData);

                            setUser(res.data);
                            localStorage.setItem("user", JSON.stringify(res.data));
                            setEditing(false);

                        }}
                        style={{ ...btnStyle, marginTop: "10px" }}
                    >
                        Save Changes
                    </button>

                </div>
            )}

            {/* RECIPES */}
            <h2 style={{ marginTop: "40px" }}>My Recipes 🍳</h2>

            {recipes.length === 0 ? (
                <p>No recipes yet</p>
            ) : (
                recipes.map(recipe => (

                    <div key={recipe._id} style={cardStyle}>

                        <h3>{recipe.title}</h3>

                        {isOwnProfile && (
                            <div style={{ display: "flex", gap: "10px" }}>

                                <button
                                    onClick={() => window.location.href = `/edit/${recipe._id}`}
                                    style={btnStyle}
                                >
                                    ✏ Edit
                                </button>

                                <button
                                    onClick={async () => {

                                        await API.delete(`/recipes/${recipe._id}`);

                                        setRecipes(prev =>
                                            prev.filter(r => r._id !== recipe._id)
                                        );

                                    }}
                                    style={{ ...btnStyle, background: "red" }}
                                >
                                    🗑 Delete
                                </button>

                            </div>
                        )}

                    </div>

                ))
            )}

            {/* SAVED RECIPES */}
            <h2 style={{ marginTop: "40px" }}>Saved Recipes ❤️</h2>

            {savedRecipes.length === 0 ? (
                <p>No saved recipes yet</p>
            ) : (
                savedRecipes.map(recipe => (

                    <div key={recipe._id} style={cardStyle}>

                        <h3>{recipe.title}</h3>

                        <p>⭐ {recipe.avgRating || "0"}</p>

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
    padding: "8px 15px",
    background: "#ff6b3d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
};

const inputStyle = {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd"
};

const cardStyle = {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px"
};

export default Profile;