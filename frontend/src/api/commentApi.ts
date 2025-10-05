import { axiosInstance } from './axiosInstance';
import { Comment, CreateCommentData } from '../types/comment';

export const commentAPI = {
  getByTask: (taskId: string): Promise<Comment[]> =>
    axiosInstance.get(`/comments/${taskId}`).then(res => res.data),

  create: (data: CreateCommentData): Promise<Comment> =>
    axiosInstance.post('/comments', data).then(res => res.data),

  update: (id: string, text: string): Promise<Comment> =>
    axiosInstance.put(`/comments/${id}`, { text }).then(res => res.data),

  delete: (id: string): Promise<{ message: string }> =>
    axiosInstance.delete(`/comments/${id}`).then(res => res.data),
};
