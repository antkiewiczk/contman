import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { AppRoutes } from '../../routes';
import { useUsersStore } from '../../store/usersStore';

// Mock window.scrollTo which is not implemented in JSDOM
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock the store
jest.mock('../../store/usersStore', () => ({
  useUsersStore: jest.fn()
}));

// Mock the API client to avoid network calls
jest.mock('../../api/client', () => ({
  apiClient: {
    get: jest.fn()
  }
}));

describe('User Flow Integration', () => {
  const mockUsers = [
    {
      id: '1',
      name: 'Dominic Nitzsche',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      createdAt: '2023-03-20T09:37:10.859Z'
    },
    {
      id: '2', 
      name: 'Roxanne Mills',
      avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
      createdAt: '2023-03-20T14:41:21.439Z'
    }
  ];

  const mockCompanies = [
    {
      id: '1',
      name: 'Hyatt, Johnston and Hansen',
      features: ['kittens'],
      users: ['1']
    },
    {
      id: '2',
      name: 'Tremblay, Davis and West',
      features: ['random-number'],
      users: ['1', '2']
    }
  ];

  beforeEach(() => {
    // Reset mock implementations
    jest.clearAllMocks();
    
    // Reset URL to home page
    window.history.pushState({}, '', '/');
    
    // Mock the store with initial state
    (useUsersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        users: mockUsers,
        companies: mockCompanies,
        selectedUserId: null,
        isLoading: false,
        error: null,
        setUsers: jest.fn(),
        setCompanies: jest.fn(),
        setSelectedUserId: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        getUserById: (id: string) => mockUsers.find(user => user.id === id),
        getCompaniesByUserId: (userId: string) => 
          mockCompanies.filter(company => company.users.includes(userId)),
        getAccessibleFeatures: (userId: string) => {
          const userCompanies = mockCompanies.filter(company => company.users.includes(userId));
          const features = new Set<string>();
          userCompanies.forEach(company => {
            company.features.forEach(feature => features.add(feature));
          });
          return Array.from(features);
        },
        fetchUserData: jest.fn().mockResolvedValue(undefined),
        fetchAllData: jest.fn().mockResolvedValue(undefined)
      };
      
      return selector ? selector(state) : state;
    });
  });

  it('navigates from users list to user details and shows accessible features', async () => {
    // Render the app with router
    render(<AppRoutes />);

    // Wait for initial load - use getByRole to be more specific for page header
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Users', level: 1 })).toBeInTheDocument();
    });

    // Verify users are displayed
    expect(screen.getByText('Dominic Nitzsche')).toBeInTheDocument();
    expect(screen.getByText('Roxanne Mills')).toBeInTheDocument();

    // Find and click on Dominic's "View Details" link
    // Use getAllByRole to get all links, then find the one for Dominic
    const viewDetailsLinks = screen.getAllByRole('link', { name: /View Details/ });
    expect(viewDetailsLinks.length).toBe(2); // Should have 2 users
    
    await act(async () => {
      fireEvent.click(viewDetailsLinks[0]); // First user (Dominic)
    });

    // Wait for navigation to user details page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dominic Nitzsche', level: 2 })).toBeInTheDocument();
    });

    // Verify user details are shown
    expect(screen.getByText(/Mar 20, 2023/)).toBeInTheDocument();
    
    // Verify companies are shown
    expect(screen.getByText('Hyatt, Johnston and Hansen')).toBeInTheDocument();
    expect(screen.getByText('Tremblay, Davis and West')).toBeInTheDocument();
    
    // Verify accessible features are shown
    expect(screen.getByText('kittens')).toBeInTheDocument();
    expect(screen.getByText('random-number')).toBeInTheDocument();
    
    // Verify feature components render
    expect(screen.getByText('Kittens')).toBeInTheDocument();
    expect(screen.getByText('Random Number')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });

  it('handles loading and user not found states', async () => {
    // Mock loading state
    (useUsersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        users: [],
        companies: [],
        selectedUserId: null,
        isLoading: true,
        error: null,
        setUsers: jest.fn(),
        setCompanies: jest.fn(),
        setSelectedUserId: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        getUserById: jest.fn(),
        getCompaniesByUserId: jest.fn(),
        getAccessibleFeatures: jest.fn(),
        fetchUserData: jest.fn().mockResolvedValue(undefined),
        fetchAllData: jest.fn().mockResolvedValue(undefined)
      };
      
      return selector ? selector(state) : state;
    });

    render(<AppRoutes />);

    // Verify loading spinner is shown
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Mock user not found state (isLoading false, getUserById returns undefined)
    (useUsersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        users: [],
        companies: [],
        selectedUserId: null,
        isLoading: false,
        error: null,
        setUsers: jest.fn(),
        setCompanies: jest.fn(),
        setSelectedUserId: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        getUserById: () => undefined, // User not found
        getCompaniesByUserId: jest.fn(),
        getAccessibleFeatures: jest.fn(),
        fetchUserData: jest.fn().mockResolvedValue(undefined),
        fetchAllData: jest.fn().mockResolvedValue(undefined)
      };
      
      return selector ? selector(state) : state;
    });

    // Navigate to a user that doesn't exist
    window.history.pushState({}, '', '/user/999');
    
    // Re-render to show user not found
    render(<AppRoutes />);

    // Verify user not found message is shown
    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
    expect(screen.getByText(/User with ID "999" could not be found/)).toBeInTheDocument();
    expect(screen.getByText('Back to Users')).toBeInTheDocument();
  });

  it('shows correct features for different users', async () => {
    // Mock store with user 2 data
    (useUsersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        users: mockUsers,
        companies: mockCompanies,
        selectedUserId: null,
        isLoading: false,
        error: null,
        setUsers: jest.fn(),
        setCompanies: jest.fn(),
        setSelectedUserId: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        getUserById: (id: string) => mockUsers.find(user => user.id === id),
        getCompaniesByUserId: (userId: string) => 
          mockCompanies.filter(company => company.users.includes(userId)),
        getAccessibleFeatures: (userId: string) => {
          const userCompanies = mockCompanies.filter(company => company.users.includes(userId));
          const features = new Set<string>();
          userCompanies.forEach(company => {
            company.features.forEach(feature => features.add(feature));
          });
          return Array.from(features);
        },
        fetchUserData: jest.fn().mockResolvedValue(undefined),
        fetchAllData: jest.fn().mockResolvedValue(undefined)
      };
      
      return selector ? selector(state) : state;
    });

    render(<AppRoutes />);

    // Wait for users list to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Users', level: 1 })).toBeInTheDocument();
    });

    // Navigate to user 2 (Roxanne)
    const viewDetailsLinks = screen.getAllByRole('link', { name: /View Details/ });
    expect(viewDetailsLinks.length).toBe(2); // Should have 2 users
    
    await act(async () => {
      fireEvent.click(viewDetailsLinks[1]); // Second user (Roxanne)
    });

    // Wait for navigation to user details page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Roxanne Mills', level: 2 })).toBeInTheDocument();
    });

    // User 2 should only have access to random-number (from company 2)
    const randomNumberElements = screen.getAllByText('random-number');
    expect(randomNumberElements.length).toBeGreaterThan(0);
    expect(screen.queryByText('kittens')).not.toBeInTheDocument();
    
    // Only Random Number feature should be shown
    expect(screen.getByText('Random Number')).toBeInTheDocument();
    expect(screen.queryByText('Kittens')).not.toBeInTheDocument();
  });
});