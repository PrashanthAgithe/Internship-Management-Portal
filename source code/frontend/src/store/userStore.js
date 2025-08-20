import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
}));
