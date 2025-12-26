import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api-v1";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptors ---

// Request Interceptor: Attaches the token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token ?? ""}`;
  }
  return config;
});

// Response Interceptor: Handles global errors like 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch a custom event to trigger logout in AuthProvider
      window.dispatchEvent(new Event("force-logout"));
    }
    return Promise.reject(error);
  }
);

// --- API Methods ---

const postData = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await api.post(url, data);
  return response.data;
};

const updateData = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await api.put(url, data);
  return response.data;
};

const fetchData = async <T>(url: string): Promise<T> => {
  const response = await api.get(url);
  return response.data;
};

const deleteData = async <T>(url: string): Promise<T> => {
  const response = await api.delete(url);
  return response.data;
};

// ✅ New Function: Handles file uploads
const uploadFile = async <T>(url: string, file: File): Promise<T> => {
  const formData = new FormData();
  formData.append("file", file); // The key "file" must match backend middleware

  const response = await api.post(url, formData, {
    headers: {
      // Overriding the default JSON header for multipart data
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export { postData, fetchData, updateData, deleteData, uploadFile };
