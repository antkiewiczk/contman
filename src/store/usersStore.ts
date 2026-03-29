import { create } from 'zustand';
import type { User, Company } from '../types';
import usersData from '../api/mock/users.json';
import companiesData from '../api/mock/companies.json';

interface UsersState {
  users: User[];
  companies: Company[];
  selectedUserId: string | null;
  isLoading: boolean;
  error: string | null;
  
  setUsers: (users: User[]) => void;
  setCompanies: (companies: Company[]) => void;
  setSelectedUserId: (userId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  getUserById: (id: string) => User | undefined;
  getCompaniesByUserId: (userId: string) => Company[];
  getAccessibleFeatures: (userId: string) => string[];
  
  // New actions for fetching individual data
  fetchUserData: (userId: string) => Promise<void>;
  fetchAllData: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  companies: [],
  selectedUserId: null,
  isLoading: false,
  error: null,
  
  setUsers: (users) => set({ users }),
  setCompanies: (companies) => set({ companies }),
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  getUserById: (id) => {
    const { users } = get();
    return users.find(user => user.id === id);
  },
  
  getCompaniesByUserId: (userId) => {
    const { companies } = get();
    return companies.filter(company => company.users?.includes(userId));
  },
  
  getAccessibleFeatures: (userId) => {
    const { companies } = get();
    const userCompanies = companies.filter(company => company.users?.includes(userId));
    const features = new Set<string>();
    
    userCompanies.forEach(company => {
      company.features?.forEach(feature => features.add(feature));
    });
    
    return Array.from(features);
  },
  
  fetchUserData: async (userId: string) => {
    const state = get();
    
    // If we already have the user and companies data, no need to fetch
    const existingUser = state.users.find(user => user.id === userId);
    if (existingUser && state.companies.length > 0) {
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // Use data from JSON files
      const mockUsers = usersData;
      const mockCompanies = companiesData;

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set({ 
        users: mockUsers, 
        companies: mockCompanies,
        isLoading: false 
      });
    } catch (err) {
      set({ 
        error: 'Failed to load user data', 
        isLoading: false 
      });
      console.error(err);
    }
  },
  
  fetchAllData: async () => {
    const state = get();
    
    // If we already have data, no need to fetch
    if (state.users.length > 0 && state.companies.length > 0) {
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // Use data from JSON files
      const mockUsers = usersData;
      const mockCompanies = companiesData;

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set({ 
        users: mockUsers, 
        companies: mockCompanies,
        isLoading: false 
      });
    } catch (err) {
      set({ 
        error: 'Failed to load data', 
        isLoading: false 
      });
      console.error(err);
    }
  },
}));