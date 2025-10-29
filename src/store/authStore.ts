import { create } from "zustand";

interface User {
  accessToken: string,
  userId: string,
  role: string,
  firstName: string,
  lastName: string, 
  bio: string | null
}

interface AuthState {
  user: User | null
  setUser: (user: User) => void;
  logout: () => void;
}

const toJson = (obj: string | null) => obj == null ? null : JSON.parse(obj);

export const useAuthStore = create<AuthState>((set) => ({
  user: toJson(localStorage.getItem("user")),
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({user});
  },
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));
