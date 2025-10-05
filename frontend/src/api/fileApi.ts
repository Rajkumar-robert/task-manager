import { axiosInstance } from './axiosInstance';

export const fileAPI = {
  upload: (taskId: string, files: FileList) => {
    const formData = new FormData();
    formData.append('taskId', taskId);
    Array.from(files).forEach(file => formData.append('files', file));
    return axiosInstance.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },
  
  getByTask: (taskId: string) =>
    axiosInstance.get(`/files/${taskId}`).then(res => res.data),

  download: (fileId: string) =>
    axiosInstance.get(`/files/download/${fileId}`, {
      responseType: 'blob'
    }).then(res => res.data),

  delete: (fileId: string) =>
    axiosInstance.delete(`/files/${fileId}`).then(res => res.data),
};