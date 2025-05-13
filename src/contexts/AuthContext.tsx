import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, type UserResponse, type TokenResponse } from '@/services/auth.service';
import axios from 'axios';

interface AuthContextType {
  user: UserResponse | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Configurar interceptor de axios para manejar refresh token
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log(error);
        console.log(error.config);
        // Si el error es 401 y no es una petición de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Intentar obtener nuevo access token
            const response = await axios.post('/auth/refresh');
            const newAccessToken = response.data.access_token;
            
            // Actualizar el token en el estado
            setAccessToken(newAccessToken);
            
            // Actualizar el header de la petición original
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            // Reintentar la petición original
            return axios(originalRequest);
          } catch (refreshError) {
            // Si el refresh falla, hacer logout
            await logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Limpiar interceptor cuando el componente se desmonte
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Configurar interceptor de request
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      if (accessToken) {
        // Directly set the Authorization header on the AxiosHeaders instance
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    // Al desmontar, quitar el interceptor
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
    };
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      console.log(response);
      setAccessToken(response.access_token);
      
      // Obtener información del usuario
      const userResponse = await authService.getCurrentUser();
      setUser(userResponse);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setAccessToken(null);
      // Limpiar headers de axios
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    accessToken,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}