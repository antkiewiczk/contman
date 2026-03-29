import { apiClient } from '../client';
import type { User } from '../../types';

export const usersApi = {
  getAll: () => apiClient.get<User[]>('/users'),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),
};