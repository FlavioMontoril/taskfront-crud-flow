import { create } from "zustand";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   department: string;
//   role: {
//     id: string;
//     name: string;
//   };
// }

export interface RoleData {
  id?: string;
  name: RoleOptions;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  user?: User[];
}
export enum RoleOptions {
    MASTER = 'MASTER',
    ADMIN = 'ADMIN',
    COMMON = 'COMMON',
    GUEST = 'GUEST',
}

interface User {
  id: string;
  name: string;
  email: string;
  role: RoleData;
  department: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  finishLoading: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) =>
    set({ user, isLoading: false }),

  clearUser: () =>
    set({ user: null, isLoading: false }),

  finishLoading: () =>
    set({ isLoading: false }),
}));
