import { create } from 'zustand';
import axios from 'axios';
import { authService, type UserResponse, type TokenResponse } from '@/services/auth.service';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: async (email: string, password: string): Promise<void> => {
    const response = await authService.login({ email, password });
    set({ accessToken: response.access_token, isAuthenticated: true });
    const userResponse = await authService.getCurrentUser();
    set({ user: userResponse });
  },

  logout: async (): Promise<void> => {
    await authService.logout();
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));

// Request interceptor: add Authorization header if token exists
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: on 401 try refresh, else logout
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await authService.refreshToken();
        useAuthStore.setState({ accessToken: refreshRes.access_token, isAuthenticated: true });
      } catch (refreshError) {
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
      originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
); 