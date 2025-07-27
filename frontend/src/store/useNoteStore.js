import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";


export const useNoteStore = create((set) => ({
  projectNotes: [],
  note: null,
  isLoading: false,
    setProjectNotes: (notes) => set({ projectNotes: notes }),
  createNote: async (data, projectId) => {
    set({isLoading: true})
    try {
        console.log("Note data",data);
        
        const res = await axiosInstance.post(`/notes/new/${projectId}`, data)
        set((state) => ({
        projectNotes: [...state.projectNotes, res.data.data],
      }))
      console.log("Note res",res.data.data);
    } catch (error) {
        console.log("Error while creating notes.", error);
        toast.error("Error in creating note.")        
    } finally {
        set({isLoading: false})
    }
  },

  getProjectNotes: async (projectId) => {
    set({isLoading: true})
    try {
        const res = await axiosInstance.get(`/notes/get-all/${projectId}`)
        set({projectNotes: res.data.data});      
        console.log(res.data.data);
    } catch (error) {
        console.log("Error while geting projects notes",  error);        
    } finally {
        set({isLoading: false})
    }
  }
}));
