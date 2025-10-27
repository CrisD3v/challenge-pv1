import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reducir timeout para fallar más rápido
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    const errorStatus = error.response?.status;

    console.warn(`API Error [${errorStatus}]:`, errorMessage);
    console.warn("API URL:", API_BASE_URL);

    // Crear un error más descriptivo
    const enhancedError = new Error(`API Error: ${errorMessage}`);
    enhancedError.name = "APIError";
    (enhancedError as any).status = errorStatus;
    (enhancedError as any).originalError = error;

    return Promise.reject(enhancedError);
  },
);

// Request interceptor para logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  },
);
