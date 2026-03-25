import api from './axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', data);
  return response.data;
};