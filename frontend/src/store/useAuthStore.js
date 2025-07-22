import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  userStats: null,
  userGraphStats: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  isForgotPassword: false,
  isLoadding: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/users/check-user");
      console.log("check", response.data);
      set({ authUser: response.data.data });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigninUp: true });
      const res = await axiosInstance.post("/users/register", data);
      console.log("Register : ", res.data.data);
      set({ authUser: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      // Access backend's ApiError response
      if (axios.isAxiosError(error)) {
        const { response } = error;
        console.log(response);
        if (response) {
          console.error("Backend Error:", response.data);
          toast.error(response.data.message); 
        } else {
          console.error("No response from server.");
        }
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      set({ isSigninUp: false });
    }
  },

  signin: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);
      set({ authUser: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { response } = error;
        console.log(response);
        if (response) {
          console.error("Backend Error:", response.data);
          toast.error(response.data.message); // or show in UI
          // optional: loop through `response.data.errors` if it's an array
        } else {
          console.error("No response from server.");
        }
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/users/logout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },

}));
