import api from './axios';
import { HealthCheckResponse } from '../types';

export const getHealthHistoryApi = async (endpointId: number): Promise<HealthCheckResponse[]> => {
  const response = await api.get<HealthCheckResponse[]>(`/api/health/history/${endpointId}`);
  return response.data;
};

export {};
