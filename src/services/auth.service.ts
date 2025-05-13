import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/auth'

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  // Add other user fields as needed
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

class AuthService {
  async login(loginData: LoginRequest): Promise<TokenResponse> {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
  }

  async register(userData: { email: string; password: string }): Promise<UserResponse> {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/logout`);
  }

  async refreshToken(): Promise<TokenResponse> {
    const response = await axios.post(`${API_URL}/refresh`);
    return response.data;
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  }
}

export const authService = new AuthService(); 