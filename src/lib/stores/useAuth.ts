import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOGIN_API, ME_API, REGISTER_API, UPDATE_PROFILE_API,  } from '@/app/api';
import { DeliveryAddress } from '@/hooks/delivery-address.hook';

export interface User {
  id: number;
  name: string;
  delivery_address?: DeliveryAddress | null;
  email: string;
  phone?: string | null;
  role: 'admin' | 'staff' | 'user';
  user_image?: string | null;
  created_at: string;
  updated_at: string;
  // Allow additional fields from API
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthActions {
  setUser: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  updateDeliveryAddress: (deliveryAddress: DeliveryAddress) => void;
  clearDeliveryAddress: () => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

// API URLs are now imported from centralized api.ts file

export const useAuth = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // Actions
      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      updateDeliveryAddress: (deliveryAddress: DeliveryAddress) => {
        set((state) => ({
          user: state.user ? { ...state.user, delivery_address: deliveryAddress } : null,
        }));
      },

      clearDeliveryAddress: () => {
        set((state) => ({
          user: state.user ? { ...state.user, delivery_address: null } : null,
        }));
      },

      clearUser: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.data.access_token) {
        return {
          success: true,
          user: result.data.user,
          token: result.data.access_token,
          message: result.message,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Login failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network error occurred',
      };
    }
  },

  register: async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await fetch(REGISTER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      const result = await response.json();

      if (result.success && result.data.access_token) {
        return {
          success: true,
          user: result.data.user,
          token: result.data.access_token,
          message: result.message,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Registration failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network error occurred',
      };
    }
  },

  fetchProfile: async (token: string) => {
    try {
      const response = await fetch(ME_API, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return {
            success: true,
            user: result.data,
          };
        }
      }
      return { success: false, message: 'Failed to fetch profile' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error' };
    }
  },

  updateProfile: async (token: string,  data: { name: string; email: string; user_image?: File }) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      
      if (data.user_image) {
        formData.append('user_image', data.user_image);
      }

      const response = await fetch(UPDATE_PROFILE_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        return {
          success: true,
          data: result.data,
          message: result.message || 'Profile updated successfully',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to update profile',
        };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error' };
    }
  },
};
