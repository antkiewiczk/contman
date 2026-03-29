import { apiClient } from '../client';
import type { Company } from '../../types';

export const companiesApi = {
  getAll: () => apiClient.get<Company[]>('/companies'),
  getById: (id: string) => apiClient.get<Company>(`/companies/${id}`),
  getByUserId: (userId: string) => 
    apiClient.get<Company[]>(`/companies?userId=${userId}`),
};