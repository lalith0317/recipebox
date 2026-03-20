import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

        const res = await API.post("/auth/login", {
            email,
            password
        });

        console.log("Login success:", res.data);

        localStorage.setItem("token", res.data.token);

        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.location.href = "/home";

        } catch (error) {

        console.error(error);
        alert("Invalid email or password");

        }
    };

    return (

        <div style={pageStyle}>

        <div style={cardStyle}>

            <h2 style={{marginBottom:"25px"}}>Login</h2>

            <form onSubmit={handleLogin}>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                style={inputStyle}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
                Login
            </button>

            </form>

            <p style={{marginTop:"20px"}}>
            Don't have an account?{" "}
            <Link to="/register" style={linkStyle}>
                Register
            </Link>
            </p>

        </div>

        </div>

    );
    }

    const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f6f6f6"
    };

    const cardStyle = {
    width: "350px",
    padding: "40px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center"
    };

    const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd"
    };

    const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#ff6b3d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
    };

    const linkStyle = {
    color: "#ff6b3d",
    fontWeight: "bold",
    textDecoration: "none"
    };

export default Login;