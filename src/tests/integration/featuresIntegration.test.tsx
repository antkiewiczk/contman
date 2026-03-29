import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetailsPage from '../../components/pages/UserDetailsPage';

// Mock window.scrollTo which is not implemented in JSDOM
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});
import { useUsersStore } from '../../store/usersStore';

// Mock the store
jest.mock('../../store/usersStore', () => ({
  useUsersStore: jest.fn()
}));

// Mock feature components to avoid external API calls in tests
jest.mock('../../components/features/Kittens', () => ({
  Kittens: ({ userId, companyId }: { userId: string; companyId?: string }) => (
    <div data-testid="kittens-component">
      <h3>Kittens</h3>
      <p>Mock kittens for user {userId}{companyId && ` in company ${companyId}`}</p>
    </div>
  )
}));

jest.mock('../../components/features/RandomNumber', () => ({
  RandomNumber: ({ userId, companyId }: { userId: string; companyId?: string }) => (
    <div data-testid="random-number-component">
      <h3>Random Number</h3>
      <p>Mock random number for user {userId}{companyId && ` in company ${companyId}`}</p>
    </div>
  )
}));

describe('Features Integration', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: '2023-01-01T00:00:00.000Z'
  };

  const mockCompanies = [
    {
      id: '1',
      name: 'Company A',
      features: ['kittens', 'random-number'],
      users: ['1']
    },
    {
      id: '2',
      name: 'Company B',
      features: ['company'],
      users: ['1']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useUsersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        users: [mockUser],
        companies: mockCompanies,
        selectedUserId: null,
        isLoading: false,
        error: null,
        setUsers: jest.fn(),
        setCompanies: jest.fn(),
        setSelectedUserId: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        getUserById: (id: string) => id === '1' ? mockUser : undefined,
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

  it('renders all feature components for user with full access', async () => {
    render(
      <MemoryRouter initialEntries={['/user/1']}>
        <Routes>
          <Route path="/user/:userId" element={<UserDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for user data to load - use getByRole to be more specific
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test User', level: 2 })).toBeInTheDocument();
    });

    // Verify all feature components are rendered
    expect(screen.getByTestId('kittens-component')).toBeInTheDocument();
    expect(screen.getByTestId('random-number-component')).toBeInTheDocument();
    
    // Verify company component is rendered (not mocked)
    // "Companies" appears multiple times, so use getAllByText
    const companiesHeaders = screen.getAllByText('Companies');
    expect(companiesHeaders.length).toBeGreaterThan(0);
    
    // Company names appear in multiple places, use getAllByText and check at least one exists
    const companyAElements = screen.getAllByText('Company A');
    const companyBElements = screen.getAllByText('Company B');
    expect(companyAElements.length).toBeGreaterThan(0);
    expect(companyBElements.length).toBeGreaterThan(0);
    
    // Verify feature badges are shown - use getAllByText since there are multiple instances
    const kittensElements = screen.getAllByText('kittens');
    const randomNumberElements = screen.getAllByText('random-number');
    const companyElements = screen.getAllByText('company');
    expect(kittensElements.length).toBeGreaterThan(0);
    expect(randomNumberElements.length).toBeGreaterThan(0);
    expect(companyElements.length).toBeGreaterThan(0);
  });

  it('only renders features that user has access to', async () => {
    // Mock user with only 'kittens' access
    const limitedCompanies = [
      {
        id: '1',
        name: 'Limited Company',
        features: ['kittens'],
        users: ['1']
      }
    ];

    (useUsersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        users: [mockUser],
        companies: limitedCompanies,
        selectedUserId: null,
        isLoading: false,
        error: null,
        setUsers: jest.fn(),
        setCompanies: jest.fn(),
        setSelectedUserId: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        getUserById: (id: string) => id === '1' ? mockUser : undefined,
        getCompaniesByUserId: (userId: string) => 
          limitedCompanies.filter(company => company.users.includes(userId)),
        getAccessibleFeatures: () => ['kittens'],
        fetchUserData: jest.fn().mockResolvedValue(undefined),
        fetchAllData: jest.fn().mockResolvedValue(undefined)
      };
      
      return selector ? selector(state) : state;
    });

    render(
      <MemoryRouter initialEntries={['/user/1']}>
        <Routes>
          <Route path="/user/:userId" element={<UserDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test User', level: 2 })).toBeInTheDocument();
    });

    // Only kittens component should be rendered
    expect(screen.getByTestId('kittens-component')).toBeInTheDocument();
    expect(screen.queryByTestId('random-number-component')).not.toBeInTheDocument();
    
    // Only kittens feature badge should be shown
    const kittensElements = screen.getAllByText('kittens');
    expect(kittensElements.length).toBeGreaterThan(0);
    expect(screen.queryByText('random-number')).not.toBeInTheDocument();
    expect(screen.queryByText('company')).not.toBeInTheDocument();
  });

  it('handles user with no feature access', async () => {
    // Mock user with no feature access
    const noFeatureCompanies = [
      {
        id: '1',
        name: 'No Feature Company',
        features: [],
        users: ['1']
      }
    ];

    (useUsersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        users: [mockUser],
        companies: noFeatureCompanies,
        selectedUserId: null,
        isLoading: false,
        error: null,
        setUsers: jest.fn(),
        setCompanies: jest.fn(),
        setSelectedUserId: jest.fn(),
        setLoading: jest.fn(),
        setError: jest.fn(),
        getUserById: (id: string) => id === '1' ? mockUser : undefined,
        getCompaniesByUserId: (userId: string) => 
          noFeatureCompanies.filter(company => company.users.includes(userId)),
        getAccessibleFeatures: () => [],
        fetchUserData: jest.fn().mockResolvedValue(undefined),
        fetchAllData: jest.fn().mockResolvedValue(undefined)
      };
      
      return selector ? selector(state) : state;
    });

    render(
      <MemoryRouter initialEntries={['/user/1']}>
        <Routes>
          <Route path="/user/:userId" element={<UserDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test User', level: 2 })).toBeInTheDocument();
    });

    // No feature components should be rendered
    expect(screen.queryByTestId('kittens-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('random-number-component')).not.toBeInTheDocument();
    
    // Company component should still show the company
    const companiesElements = screen.getAllByText('Companies');
    expect(companiesElements.length).toBeGreaterThan(0);
    expect(screen.getByText('No Feature Company')).toBeInTheDocument();
    
    // No feature badges should be shown
    expect(screen.queryByText('kittens')).not.toBeInTheDocument();
    expect(screen.queryByText('random-number')).not.toBeInTheDocument();
    expect(screen.queryByText('company')).not.toBeInTheDocument();
  });

  it('shows loading state while fetching user data', async () => {
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

    render(
      <MemoryRouter initialEntries={['/user/1']}>
        <Routes>
          <Route path="/user/:userId" element={<UserDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Loading spinner should be shown
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // No user data should be shown yet
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    expect(screen.queryByTestId('kittens-component')).not.toBeInTheDocument();
  });
});