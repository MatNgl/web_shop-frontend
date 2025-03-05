
import axiosInstance from './axiosInstance';

export async function login(email, password) {
  return axiosInstance.post('/auth/login', { email, password });
}

export async function register(userData) {
  return axiosInstance.post('/auth/register', userData);
}
