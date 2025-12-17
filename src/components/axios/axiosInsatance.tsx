// lib/axiosinstance.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
export { AxiosError } from "axios";

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Only add token if it exists and we're not on SSR
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        
        // Log request for debugging
        console.log('Making request to:', config.url, 'with data:', config.data);
        
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('Response received:', response.status, response.data);
        return response;
      },
      (error) => {
        console.error('Response error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            console.warn("Unauthorized - redirecting to login");
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/auth";
          }
        }
        
        // Handle 404 Not Found
        if (error.response?.status === 404) {
          console.error('Endpoint not found. Check the URL:', error.config?.url);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // GET request
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  // POST request
  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  // POST request with full response
  public async postWithResponse<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response;
  }

  // PUT request
  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  // DELETE request
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }
}

// IMPORTANT: Your login endpoint structure is different
// Login endpoint: http://127.0.0.1:7000/api/v1/accounts/login-user-phone/?phone=phone
// This means the base URL should be: http://127.0.0.1:7000/

// For auth endpoints
const authBaseURL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://127.0.0.1:8000/";
// For other API endpoints
const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1/";

// Create instances
export const authApi = new ApiService(authBaseURL); // For auth endpoints (starting from root)
export const api = new ApiService(apiBaseURL); // For other endpoints

export default api;