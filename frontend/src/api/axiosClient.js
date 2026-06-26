import axios from "axios";

console.log("ENV:", import.meta.env);
console.log("API:", import.meta.env.VITE_API_BASE_URL);

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;