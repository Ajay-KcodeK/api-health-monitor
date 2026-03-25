import api from './axios';
import { EndpointRequest, EndpointResponse, DashboardSummary } from '../types';

export const addEndpointApi = async (data: EndpointRequest): Promise<EndpointResponse> => {
  const response = await api.post<EndpointResponse>('/api/endpoints', data);
  return response.data;
};

export const getEndpointsApi = async (): Promise<EndpointResponse[]> => {
  const response = await api.get<EndpointResponse[]>('/api/endpoints');
  return response.data;
};

export const getDashboardSummaryApi = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>('/api/endpoints/summary');
  return response.data;
};

export const deleteEndpointApi = async (id: number): Promise<void> => {
  await api.delete(`/api/endpoints/${id}`);
};