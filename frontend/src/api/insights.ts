import api from './axios';
import { InsightResponse } from '../types';

export const getInsightsApi = async (endpointId: number): Promise<InsightResponse> => {
  const response = await api.get<InsightResponse>(`/api/insights/${endpointId}`);
  return response.data;
};