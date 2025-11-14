import { create } from "zustand";
import axios from "axios";

// Base API URL
const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/user";

export const useUserStore = create((set, get) => ({

  // ============================
  // AUTH STATE
  // ============================
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // ============================
  // CHECK AUTH ON APP LOAD
  // ============================
  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false });
      return false;
    }

    try {
      const response = await axios.get(`${API_URL}/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
      });

      return true;
    } catch (error) {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: error.response?.data?.message || "Authentication failed",
      });

      return false;
    }
  },

  // ============================
  // SIGNUP
  // ============================
  signup: async (userData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      const { user, token } = response.data;

      localStorage.setItem("token", token);

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return { success: true, user };
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Signup failed",
      });

      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  },

  // ============================
  // SIGNIN
  // ============================
  signin: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signin`, credentials);
      const { user, token } = response.data;

      localStorage.setItem("token", token);

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return { success: true, user };
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Signin failed",
      });

      return {
        success: false,
        error: error.response?.data?.message || "Signin failed",
      };
    }
  },

  // ============================
  // LOGOUT
  // ============================
  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // ============================
  // CLEAR ERROR
  // ============================
  clearError: () => set({ error: null }),

  // ====================================================================
  // TEACHER FEATURES
  // ====================================================================

  students: [],
  studentsLoading: false,
  studentsError: null,

  // ============================
  // FETCH ALL STUDENTS (TEACHER ONLY)
  // ============================
  fetchStudents: async () => {
    const token = get().token;
    set({ studentsLoading: true, studentsError: null });

    try {
      const res = await axios.get(`${API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        students: res.data.students,
        studentsLoading: false,
      });
    } catch (error) {
      console.error("Fetch Students Error:", error);

      set({
        studentsError:
          error.response?.data?.message || "Failed to fetch students",
        studentsLoading: false,
      });
    }
  },

  // ============================
  // APPROVE OR REJECT ONE DOCUMENT
  // ============================
  updateDocumentStatus: async (studentId, docType, status, comment = "") => {
    const token = get().token;

    set({ studentsLoading: true });

    try {
      await axios.patch(
        `${API_URL}/approve/${studentId}/${docType}`,
        { status, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh updated students list
      await get().fetchStudents();
    } catch (error) {
      console.error("Document Status Update Error:", error);

      set({
        studentsError:
          error.response?.data?.message || "Failed to update document",
      });
    } finally {
      set({ studentsLoading: false });
    }
  },

}));
