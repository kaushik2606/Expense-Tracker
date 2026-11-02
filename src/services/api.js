import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getErrorMessage = (error, fallback) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (!error.response) {
      return "Could not connect to the server. Check that the backend is running.";
    }
  }

  return error.message || fallback;
};

export default api;
