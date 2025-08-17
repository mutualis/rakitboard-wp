import { wpApi } from './config';
import axios from 'axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface JWTResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: string[];
  capabilities: Record<string, boolean>;
}

export const authService = {
  // JWT Authentication
  jwt: {
    // Login with JWT
    login: async (credentials: LoginCredentials): Promise<JWTResponse> => {
      const response = await axios.post<JWTResponse>(
        `${wpApi.defaults.baseURL?.replace('/wp/v2', '')}/jwt-auth/v1/token`,
        credentials
      );
      
      // Store token
      localStorage.setItem('wp_token', response.data.token);
      
      return response.data;
    },

    // Validate token
    validate: async (): Promise<boolean> => {
      try {
        await axios.post(
          `${wpApi.defaults.baseURL?.replace('/wp/v2', '')}/jwt-auth/v1/token/validate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('wp_token')}`,
            },
          }
        );
        return true;
      } catch {
        return false;
      }
    },

    // Logout
    logout: (): void => {
      localStorage.removeItem('wp_token');
    },
  },

  // Application Password Authentication
  appPassword: {
    // Set application password
    setCredentials: (username: string, appPassword: string): void => {
      const credentials = btoa(`${username}:${appPassword}`);
      localStorage.setItem('wp_app_credentials', credentials);
      
      // Update axios default header
      wpApi.defaults.headers.Authorization = `Basic ${credentials}`;
    },

    // Clear credentials
    clearCredentials: (): void => {
      localStorage.removeItem('wp_app_credentials');
      delete wpApi.defaults.headers.Authorization;
    },
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await wpApi.get<User>('/users/me');
    return response.data;
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!(localStorage.getItem('wp_token') || localStorage.getItem('wp_app_credentials'));
  },
};