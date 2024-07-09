import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const getHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

axios.interceptors.request.use(
  (config) => {
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = async (userDetails) => {
  return api.post("/auth/register", userDetails);
};

export const login = async (userDetails) => {
  return api.post("/auth/login", userDetails);
};

export const getUser = async () => {
  const headers = getHeaders();
  return api.get("/users/me", { headers });
};

export const getUserEmails = async () => {
  const headers = getHeaders();
  return api.get("/users/emails", { headers });
};

export const getTasks = async () => {
  const headers = getHeaders();
  return api.get("/tasks", { headers });
};

export const createTask = async (taskDetails) => {
  const headers = getHeaders();
  return api.post("/tasks", taskDetails, { headers });
};

export const updateTask = async (taskId, taskDetails) => {
  const headers = getHeaders();
  return api.patch(`/tasks/${taskId}`, taskDetails, { headers }); // Changed to PATCH for partial updates
};

export const deleteTask = async (taskId) => {
  const headers = getHeaders();
  return api.delete(`/tasks/${taskId}`, { headers });
};

export const shareTask = async (taskId, sharingDetails) => {
  const headers = getHeaders();
  return api.patch(`/tasks/${taskId}/share`, sharingDetails, { headers });
};
