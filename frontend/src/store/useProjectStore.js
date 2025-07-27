import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const usePojectStore = create((set) => ({
  userProjects: [],
  projectMembers: [],
  project: null,
  isProjects: false,
  isCreatingProject: false,
  isUpdatingProject: false,
  isLoading: false,

  getUserProjects: async () => {
    set({ isProjects: true });
    try {
      const res = await axiosInstance.get("/projects/get-user-projects");
      console.log("projects", res.data.data);
      set({ userProjects: res.data.data });
    } catch (error) {
      console.log("Error", error);
    } finally {
      set({ isProjects: false });
    }
  },

  getProjectById: async (projectId) => {
    set({ isProjects: true });
    try {
      const res = await axiosInstance.get(
        `/projects/get-project-by-id/${projectId}`,
      );      
      set({ project: res.data.data });
    } catch (error) {
      console.log("Error while get project", error);
    } finally {
      set({ isProjects: false });
    }
  },

  createProject: async (data) => {
    set({ isCreatingProject: true });
    try {
      const res = await axiosInstance.post("/projects/new-project", data);
      set((state) => ({
        userProjects: [...state.userProjects, res.data.data],
      }));
      toast.success("Project create successfully.");
    } catch (error) {
      console.log("Error while creating project", error);
    } finally {
      set({ isCreatingProject: false });
    }
  },

  updateProject: async (updatedData, projectId) => {
    set({ isUpdatingProject: true });
    try {
      const res = await axiosInstance.put(
        `/projects/update-project/${projectId}`,
        updatedData,
      );
      console.log("update", res);

      const updatedProject = res.data.data;

      if (updatedProject) {
      set((state) => ({
        userProjects: state.userProjects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project,
        ),
      }));

      toast.success("Project updated successfully.");
      } else {
        toast.error("Failed to retrieve updated project data.");
      }
    } catch (error) {
      console.error(
        "Error while updating project:",
        error?.response?.data || error.message,
      );
      toast.error("Something went wrong while updating the project.");
    } finally {
      set({ isUpdatingProject: false });
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.delete(
        `/projects/delete-project/${projectId}`,
      );
      console.log("Deleted project response:", res);
      set((state) => ({
      userProjects: state.userProjects.filter((project) => project._id !== projectId),
    }));
    toast.success("Project deleted successfully.");
    } catch (error) {
      console.log("Error while deleting project.", error);
    } finally {
      set({isLoading: false});
    }
  },

  addMember: async (data, projectId) => {
    set({isLoading : true})
    try {
      const res = await axiosInstance.post(`/projects/add-member/${projectId}`, data);
      console.log("Add", res.data.data);
      set((state) => ({
        projectMembers: [...state.projectMembers, res.data.data],
      }));
      toast.success("Member add successfully.");
    } catch (error) {
      console.log("Error while adding member.", error);      
    } finally {
      set({isLoading : false});
    }
  },

  getProjectMembers: async (projectId) => {
    set({isLoading: true})
    try {
      const res = await axiosInstance.get(`/projects/project-member/${projectId}`);
      set({projectMembers: res.data.data})
      console.log("GEt", res.data.data);
      
    } catch (error) {
      console.log("Error while get project members.", error);      
    } finally{
      set({isLoading: false})
    }
  },

  removeProjectMember: async (memberId) => {
    set({isLoading: true})

    try {
      const res = await axiosInstance.delete(`/projects/delete-member/${memberId}`)
      set((state) => ({
      projectMembers: state.projectMembers.filter((member) => member._id !== memberId),
    }))
    console.log("remove",res.data.data);    
    } catch (error) {
      console.log("Error while removeing member", error);      
    } finally {
      set({isLoading: false});
    }
  }
}));
