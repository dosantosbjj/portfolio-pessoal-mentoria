import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('auth'))?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  if (!response.data || !response.data.token) {
    throw new Error('Invalid response format: missing token');
  }
  return response;
};

export const register = (userData) => 
  api.post('/users/register', userData);

export const getUsers = () => 
  api.get('/users');

export const deleteUser = (id) => 
  api.delete(`/users/${id}`);

export const getFighters = () => 
  api.get('/fighters');

export const getFightersByWeight = (weightClass) => 
  api.get('/fighters/search', { params: { weightClass } });

export const addFighter = (fighterData) => 
  api.post('/fighters', fighterData);

export const updateFighter = (id, fighterData) => 
  api.put(`/fighters/${id}`, fighterData);

export const deleteFighter = (id) => 
  api.delete(`/fighters/${id}`);

export default api;