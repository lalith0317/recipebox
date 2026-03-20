import axios from "axios";

const API = axios.create({
    baseURL: "https://recipebox-backend-kqlp.onrender.com/api"
});

export default API;