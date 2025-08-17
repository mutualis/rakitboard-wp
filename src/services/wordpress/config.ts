import axios from 'axios';

// Base URL configuration
export const WP_BASE_URL = import.meta.env.VITE_WP_BASE_URL || 'http://localhost:10003/wp-json/wp/v2';

// Create axios instance for authenticated requests
export const wpApi = axios.create({
  baseURL: WP_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for guest requests (no credentials)
export const guestApi = axios.create({
  baseURL: WP_BASE_URL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth (only for wpApi)
wpApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling (both APIs)
const errorHandler = (error: any) => {
  console.error('WordPress API Error:', error.response?.data || error.message);
  return Promise.reject(error);
};

wpApi.interceptors.response.use((response) => response, errorHandler);
guestApi.interceptors.response.use((response) => response, errorHandler);

// Common interfaces
export interface WPResponse<T> {
  data: T;
  headers: Record<string, string>;
}

export interface WPListParams {
  per_page?: number;
  page?: number;
  search?: string;
  orderby?: 'date' | 'title' | 'id' | 'slug' | 'modified';
  order?: 'asc' | 'desc';
  _embed?: boolean;
  _fields?: string;
}