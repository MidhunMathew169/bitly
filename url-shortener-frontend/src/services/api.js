import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

console.log("VITE_API_BASE_URL:",API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//token generation
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Auth - Apis calls
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred during registration' };
    }
}

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

//get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/url/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user" };
  }
};

//create new short URL
export const createShortUrl = async (originalUrl) => {
  try {
    const response = await api.post('/url/shorten', { originalUrl });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to shorten URL" };
  }
};

// Get URLs of current user
export const getUserUrls = async () => {
  try {
    const response = await api.get('/url/my-urls');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to load URLs" };
  }
};

// Delete a URL
export const deleteUrl = async (urlId) => {
  try {
    const response = await api.delete(`/url/delete/${urlId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete URL" };
  }
};

export { api };