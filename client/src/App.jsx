import { useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RecipeDetails from "./pages/RecipeDetails";
import Register from "./pages/Register";

function App() {

  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>

      {isLoggedIn && (
        <nav style={navStyle}>

          <h2>RecipeBox</h2>

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

            <Link to="/home" style={linkStyle}>Home</Link>

            <Link to="/add" style={linkStyle}>Add Recipe</Link>

            {/* 👤 PROFILE DROPDOWN */}
            <div style={{ position: "relative" }}>

              <div
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ cursor: "pointer" }}
              >
                👤
              </div>

              {menuOpen && (
                <div style={dropdownStyle}>

                  <p onClick={() => window.location.href = `/profile/${user._id}`}>
                    Profile
                  </p>

                  <p onClick={() => window.location.href = "/home"}>
                    Home
                  </p>

                  <p onClick={() => window.location.href = "/add"}>
                    Add Recipe
                  </p>

                  <p
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </p>

                </div>
              )}

            </div>

          </div>

        </nav>
      )}

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile/:id" element={<Profile />} />

        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" />}
        />

        <Route
          path="/edit/:id"
          element={isLoggedIn ? <EditRecipe /> : <Navigate to="/" />}
        />
        
        <Route
          path="/add"
          element={isLoggedIn ? <AddRecipe /> : <Navigate to="/" />}
        />

        <Route
          path="/recipe/:id"
          element={isLoggedIn ? <RecipeDetails /> : <Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px",
  background: "#ff6b3d",
  color: "white"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold"
};

const dropdownStyle = {
  position: "absolute",
  right: 0,
  top: "40px",
  background: "white",
  color: "black",
  padding: "10px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  minWidth: "150px"
};

const dropdownItem = {
  textDecoration: "none",
  color: "black",
  fontSize: "14px"
};

const dropdownButton = {
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px"
};

export default App;