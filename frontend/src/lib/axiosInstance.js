import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_BACKEND_URL
      : import.meta.env.VITE_BACKEND_CALL,
  withCredentials: true,
});
