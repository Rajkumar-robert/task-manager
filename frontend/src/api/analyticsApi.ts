import { TaskStats, TrendData } from '../types/analytics';
import { axiosInstance } from './axiosInstance';

export const analyticsAPI = {
  getTaskStats: (): Promise<TaskStats> =>
    axiosInstance.get('/analytics/stats').then(res => res.data),

  getTaskTrends: (): Promise<TrendData[]> =>
    axiosInstance.get('/analytics/trends').then(res => res.data),
};