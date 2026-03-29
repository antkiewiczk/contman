import { render, screen } from '@testing-library/react';
import { Company } from './Company';
import { useUsersStore } from '../../store';

// Mock the store
jest.mock('../../store', () => ({
  useUsersStore: jest.fn()
}));

describe('Company', () => {
  const mockUsers = [
    { id: '1', name: 'John Doe', avatar: 'avatar1.jpg', createdAt: '2023-01-01' },
    { id: '2', name: 'Jane Smith', avatar: 'avatar2.jpg', createdAt: '2023-01-02' },
    { id: '3', name: 'Bob Johnson', avatar: 'avatar3.jpg', createdAt: '2023-01-03' },
  ];

  const mockCompanies = [
    { id: '1', name: 'Company A', features: ['kittens'], users: ['1', '2'] },
    { id: '2', name: 'Company B', features: ['random-number'], users: ['1'] },
    { id: '3', name: 'Company C', features: [], users: [] },
  ];

  beforeEach(() => {
    (useUsersStore as unknown as jest.Mock).mockReturnValue({
      users: mockUsers,
      companies: mockCompanies,
    });
  });

  it('renders companies for user', () => {
    render(<Company userId="1" />);
    
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('Company A')).toBeInTheDocument();
    expect(screen.getByText('Company B')).toBeInTheDocument();
    expect(screen.queryByText('Company C')).not.toBeInTheDocument();
  });

  it('shows members for each company', () => {
    render(<Company userId="1" />);
    
    // Use getAllByText since John Doe appears in both companies
    const johnDoeElements = screen.getAllByText('John Doe');
    expect(johnDoeElements).toHaveLength(2);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
  });

  it('shows features for each company', () => {
    render(<Company userId="1" />);
    
    expect(screen.getByText('kittens')).toBeInTheDocument();
    expect(screen.getByText('random-number')).toBeInTheDocument();
  });

  it('shows "No members" message for company with empty users array', () => {
    (useUsersStore as unknown as jest.Mock).mockReturnValue({
      users: [],
      companies: [{ id: '1', name: 'Empty Company', features: [], users: ['1'] }],
    });
    
    render(<Company userId="1" />);
    
    expect(screen.getByText('No members in this company.')).toBeInTheDocument();
  });

  it('shows "not a member" message when user has no companies', () => {
    (useUsersStore as unknown as jest.Mock).mockReturnValue({
      users: mockUsers,
      companies: mockCompanies,
    });
    
    render(<Company userId="999" />); // User not in any companies
    
    expect(screen.getByText('User is not a member of any companies.')).toBeInTheDocument();
  });

  it('displays member avatars', () => {
    render(<Company userId="1" />);
    
    const avatars = screen.getAllByRole('img');
    expect(avatars).toHaveLength(3); // John Doe appears twice (in both companies)
    expect(avatars[0]).toHaveAttribute('src', 'avatar1.jpg');
    expect(avatars[0]).toHaveAttribute('alt', 'John Doe');
  });
});