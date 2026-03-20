import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Register() {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleRegister = async (e)=>{

        e.preventDefault();

        try{

        await API.post("/auth/register",{
            name,
            email,
            password
        });

        alert("Registration successful");

        window.location.href="/";

        }catch(error){

        alert("Registration failed");

        console.error(error);

        }

    };

    return(

        <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            height:"100vh",
            background:"#f5f5f5"
        }}>

        <form
            onSubmit={handleRegister}
            style={{
                background:"white",
                padding:"40px",
                borderRadius:"10px",
                boxShadow:"0 4px 10px rgba(0,0,0,0.1)",
                width:"350px"
            }}
        >

            <h2 style={{textAlign:"center",marginBottom:"20px"}}>
                Create Account
            </h2>

            <input
                placeholder="Full Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                style={inputStyle}
            />

            <input
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                style={inputStyle}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                style={inputStyle}
            />

            <button
                type="submit"
                style={buttonStyle}
            >
                Register
            </button>

            <p style={{textAlign:"center",marginTop:"15px"}}>

                Already have an account?

            <Link to="/" style={{color:"#ff6b3d",marginLeft:"5px"}}>
                Login
            </Link>

            </p>

        </form>

        </div>

    );

}

const inputStyle={
    width:"100%",
    padding:"10px",
    marginBottom:"15px",
    border:"1px solid #ccc",
    borderRadius:"5px"
};

const buttonStyle={
    width:"100%",
    padding:"10px",
    background:"#ff6b3d",
    border:"none",
    color:"white",
    borderRadius:"5px",
    cursor:"pointer"
};

export default Register;