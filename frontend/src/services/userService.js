import api from './api';

export const getUsers = async () => {
  return await api.get('/users');
};

export const searchUsers = async (params) => {
  return await api.get('/users/search', { params });
};

export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};