import { create } from 'zustand';

interface User {
  id: string;
  customerId: string;
  name?: string;
  email?: string;
  phone?: string;
  balance: number;
  referralCode: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  hydrate: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      console.log('💧 [AuthStore] Hydrating from localStorage | Token:', token ? 'EXISTS' : 'NONE');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log('💧 [AuthStore] User loaded:', user.name || user.phone);
          set({ token, user, isAuthenticated: true, isHydrated: true });
        } catch (error) {
          console.error('💧 [AuthStore] Failed to parse user:', error);
          localStorage.clear();
          set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
        }
      } else {
        console.log('💧 [AuthStore] No session found');
        set({ isHydrated: true });
      }
    }
  },

  login: (token: string, user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('🔐 [AuthStore] Login saved | User:', user.name || user.phone);
    }
    set({ token, user, isAuthenticated: true, isHydrated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🚪 [AuthStore] Logout - session cleared');
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateUser: (user: User) => set({ user }),

  fetchUser: async () => {
    try {
      const { userAPI } = await import('@/lib/api');
      const response = await userAPI.getProfile();
      const user = response.data.data.user;

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }

      set({ user });
      console.log('👤 [AuthStore] User profile updated');
    } catch (error) {
      console.error('👤 [AuthStore] Failed to fetch user profile:', error);
    }
  },
}));
