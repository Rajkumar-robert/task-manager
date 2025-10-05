import { axiosInstance } from './axiosInstance';
import { LoginData, RegisterData, AuthResponse, User } from '../types/auth';

export const authAPI = {
  login: (data: LoginData): Promise<AuthResponse> => 
    axiosInstance.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterData): Promise<AuthResponse> => 
    axiosInstance.post('/auth/register', data).then(res => res.data),
  
  getProfile: (): Promise<User> => 
    axiosInstance.get('/auth/get-profile').then(res => res.data),
};