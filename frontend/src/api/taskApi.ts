import { axiosInstance } from './axiosInstance';
import { Task, CreateTaskData, UpdateTaskData } from '../types/task';

export const taskAPI = {
  
  getAll: (): Promise<Task[]> =>
    axiosInstance.get('/tasks').then(res => res.data),

  create: (data: CreateTaskData): Promise<Task> =>
    axiosInstance.post('/tasks', data).then(res => res.data),

  update: (id: string, data: UpdateTaskData): Promise<Task> =>
    axiosInstance.put(`/tasks/${id}`, data).then(res => res.data),

  delete: (id: string): Promise<{ message: string }> =>
    axiosInstance.delete(`/tasks/${id}`).then(res => res.data),

  getById: (id: string): Promise<Task> =>
    axiosInstance.get(`/tasks/${id}`).then(res => res.data),
};
