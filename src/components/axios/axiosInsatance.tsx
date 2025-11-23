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
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            console.warn("Unauthorized request. Redirecting to login.");
            // Remove the invalid token
            localStorage.removeItem("access_token");
            // Redirect to the login page
            window.location.href = "/accounts/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(
      url,
      config
    );
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      config
    );
    return response.data;
  }

  public async postWithResponse<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      config
    );
    return response;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      url,
      data,
      config
    );
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(
      url,
      config
    );
    return response.data;
  }
}

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://backend.dreamabroad.online/api/v2/";

const loginBaseURL =
  process.env.NEXT_PUBLIC_LOGIN_BASE_URL ||
  "https://backend.dreamabroad.online/accounts/";

export const api = new ApiService(baseURL);
export const authApi = new ApiService(loginBaseURL);

export default api;
