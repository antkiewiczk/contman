import { act } from '@testing-library/react';
import { useUsersStore } from './usersStore';

// Mock the JSON imports
jest.mock('../api/mock/users.json', () => [
  { id: '1', name: 'User 1', avatar: 'avatar1.jpg', createdAt: '2023-01-01' },
  { id: '2', name: 'User 2', avatar: 'avatar2.jpg', createdAt: '2023-01-02' },
]);

jest.mock('../api/mock/companies.json', () => [
  { id: '1', name: 'Company 1', features: ['kittens'], users: ['1'] },
  { id: '2', name: 'Company 2', features: ['random-number'], users: ['1', '2'] },
]);

describe('usersStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { setUsers, setCompanies } = useUsersStore.getState();
    setUsers([]);
    setCompanies([]);
    useUsersStore.setState({ error: null, isLoading: false });
  });

  it('initializes with empty state', () => {
    const state = useUsersStore.getState();
    
    expect(state.users).toEqual([]);
    expect(state.companies).toEqual([]);
    expect(state.selectedUserId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets users and companies', () => {
    const { setUsers, setCompanies } = useUsersStore.getState();
    
    const testUsers = [{ id: '1', name: 'Test User', avatar: '', createdAt: '' }];
    const testCompanies = [{ id: '1', name: 'Test Co', features: [], users: [] }];
    
    act(() => {
      setUsers(testUsers);
      setCompanies(testCompanies);
    });
    
    const state = useUsersStore.getState();
    expect(state.users).toEqual(testUsers);
    expect(state.companies).toEqual(testCompanies);
  });

  it('gets user by id', () => {
    const { setUsers, getUserById } = useUsersStore.getState();
    
    const testUsers = [
      { id: '1', name: 'User 1', avatar: '', createdAt: '' },
      { id: '2', name: 'User 2', avatar: '', createdAt: '' },
    ];
    
    act(() => {
      setUsers(testUsers);
    });
    
    const user = getUserById('2');
    expect(user).toEqual(testUsers[1]);
  });

  it('returns undefined for non-existent user', () => {
    const { setUsers, getUserById } = useUsersStore.getState();
    
    const testUsers = [{ id: '1', name: 'User 1', avatar: '', createdAt: '' }];
    
    act(() => {
      setUsers(testUsers);
    });
    
    const user = getUserById('999');
    expect(user).toBeUndefined();
  });

  it('gets companies by user id', () => {
    const { setCompanies, getCompaniesByUserId } = useUsersStore.getState();
    
    const testCompanies = [
      { id: '1', name: 'Company 1', features: [], users: ['1'] },
      { id: '2', name: 'Company 2', features: [], users: ['2'] },
      { id: '3', name: 'Company 3', features: [], users: ['1', '2'] },
    ];
    
    act(() => {
      setCompanies(testCompanies);
    });
    
    const userCompanies = getCompaniesByUserId('1');
    expect(userCompanies).toHaveLength(2);
    expect(userCompanies[0].id).toBe('1');
    expect(userCompanies[1].id).toBe('3');
  });

  it('gets accessible features for user', () => {
    const { setCompanies, getAccessibleFeatures } = useUsersStore.getState();
    
    const testCompanies = [
      { id: '1', name: 'Company 1', features: ['kittens', 'random-number'], users: ['1'] },
      { id: '2', name: 'Company 2', features: ['company'], users: ['1', '2'] },
      { id: '3', name: 'Company 3', features: ['kittens'], users: ['2'] },
    ];
    
    act(() => {
      setCompanies(testCompanies);
    });
    
    const features = getAccessibleFeatures('1');
    expect(features).toHaveLength(3);
    expect(features).toContain('kittens');
    expect(features).toContain('random-number');
    expect(features).toContain('company');
  });

  it('removes duplicate features', () => {
    const { setCompanies, getAccessibleFeatures } = useUsersStore.getState();
    
    const testCompanies = [
      { id: '1', name: 'Company 1', features: ['kittens', 'kittens'], users: ['1'] },
      { id: '2', name: 'Company 2', features: ['kittens'], users: ['1'] },
    ];
    
    act(() => {
      setCompanies(testCompanies);
    });
    
    const features = getAccessibleFeatures('1');
    expect(features).toEqual(['kittens']);
  });

  describe('fetchAllData', () => {
    it('fetches all data successfully', async () => {
      const { fetchAllData } = useUsersStore.getState();
      
      await act(async () => {
        await fetchAllData();
      });
      
      const state = useUsersStore.getState();
      expect(state.users).toHaveLength(2);
      expect(state.companies).toHaveLength(2);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('does not fetch if data already exists', async () => {
      const { setUsers, setCompanies, fetchAllData } = useUsersStore.getState();
      
      const testUsers = [{ id: '1', name: 'Existing', avatar: '', createdAt: '' }];
      const testCompanies = [{ id: '1', name: 'Existing', features: [], users: [] }];
      
      act(() => {
        setUsers(testUsers);
        setCompanies(testCompanies);
      });
      
      await act(async () => {
        await fetchAllData();
      });
      
      const state = useUsersStore.getState();
      expect(state.users).toEqual(testUsers); // Should not be replaced
      expect(state.companies).toEqual(testCompanies);
    });
  });

  describe('fetchUserData', () => {
    it('fetches user data successfully', async () => {
      const { fetchUserData } = useUsersStore.getState();
      
      await act(async () => {
        await fetchUserData('1');
      });
      
      const state = useUsersStore.getState();
      expect(state.users).toHaveLength(2);
      expect(state.companies).toHaveLength(2);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('does not fetch if user already exists', async () => {
      const { setUsers, setCompanies, fetchUserData } = useUsersStore.getState();
      
      const testUsers = [{ id: '1', name: 'Existing', avatar: '', createdAt: '' }];
      const testCompanies = [{ id: '1', name: 'Existing', features: [], users: [] }];
      
      act(() => {
        setUsers(testUsers);
        setCompanies(testCompanies);
      });
      
      await act(async () => {
        await fetchUserData('1');
      });
      
      const state = useUsersStore.getState();
      expect(state.users).toEqual(testUsers); // Should not be replaced
    });
  });
});