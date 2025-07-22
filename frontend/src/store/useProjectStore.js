import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const usePojectStore = create((set) => ({
  userProjects: null,
  userProject: null,
  isProjects: null,
  isCreatingProject: null,

  getUserProjects: async () => {
    set({ isProjects: true });
    try {
      const res = await axiosInstance.get("/projects/get-user-projects");
      console.log("projects",res.data.data);      
      set({ userProjects: res.data.data });
    } catch (error) {
      console.log("Error", error);
    }
  },

  getProjectById: async (projectId) => {
    set({ isProjects: true });
    try {
      const res = await axiosInstance.get(
        `/projects/get-project-by-id/${projectId}`,
      );
      set({ userProject: res.data.data });
    } catch (error) {
      console.log("Error while get project", error);
    }
  },

  createProject: async (data) => {
    console.log(data);
    
    set({isCreatingProject: true})
    try {
        const res = await axiosInstance.post("/projects/new-project", data)
        set((state) => ({
            projects: [...state.projects, res.data.data],
        }))
        toast.success("Project create successfully.")
    } catch (error) {
        console.log("Error while creating project", error);        
    }
  }
}));
