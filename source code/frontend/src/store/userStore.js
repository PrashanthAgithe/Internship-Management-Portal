import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

export const useUserStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Check authentication on app load
  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false });
      return false;
    }

    try {
      const response = await axios.get(`${API_URL}/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        user: response.data.user, 
        isAuthenticated: true,
        error: null 
      });
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: error.response?.data?.message || 'Authentication failed'
      });
      return false;
    }
  },

  // Signup function
  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false,
        error: null 
      });
      
      return { success: true, user };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Signup failed' 
      });
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  },

  // Signin function
  signin: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signin`, credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false,
        error: null 
      });
      
      return { success: true, user };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Signin failed' 
      });
      return { success: false, error: error.response?.data?.message || 'Signin failed' };
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null 
    });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Update user data
  updateUser: (userData) => set((state) => ({ 
    user: { ...state.user, ...userData } 
  })),
}));
