import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional (future-ready)
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error)
// );

export default axiosClient;
