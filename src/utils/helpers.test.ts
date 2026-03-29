import { formatDate, getUserInitials, getCompanyMembers } from './helpers';
import type { User, Company } from '../types';

describe('helpers', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2023-03-20T09:37:10.859Z';
      expect(formatDate(date)).toBe('Mar 20, 2023');
    });

    it('handles invalid date', () => {
      const date = 'invalid-date';
      expect(formatDate(date)).toBe('Invalid Date');
    });
  });

  describe('getUserInitials', () => {
    it('returns initials for full name', () => {
      expect(getUserInitials('John Doe')).toBe('JD');
    });

    it('returns initials for single name', () => {
      expect(getUserInitials('John')).toBe('J');
    });

    it('returns empty string for empty name', () => {
      expect(getUserInitials('')).toBe('');
    });

    it('handles multiple names', () => {
      expect(getUserInitials('John Michael Doe')).toBe('JM');
    });
  });

  describe('getCompanyMembers', () => {
    const mockUsers: User[] = [
      { id: '1', name: 'John', avatar: '', createdAt: '' },
      { id: '2', name: 'Jane', avatar: '', createdAt: '' },
      { id: '3', name: 'Bob', avatar: '', createdAt: '' },
    ];

    const mockCompany: Company = {
      id: '1',
      name: 'Test Company',
      features: [],
      users: ['1', '2'],
    };

    it('returns correct members for company', () => {
      const members = getCompanyMembers(mockCompany, mockUsers);
      expect(members).toHaveLength(2);
      expect(members[0].name).toBe('John');
      expect(members[1].name).toBe('Jane');
    });

    it('returns empty array for company with no users', () => {
      const company: Company = { ...mockCompany, users: [] };
      const members = getCompanyMembers(company, mockUsers);
      expect(members).toHaveLength(0);
    });

    it('returns empty array for company with empty users array', () => {
      const company: Company = { ...mockCompany, users: [] };
      const members = getCompanyMembers(company, mockUsers);
      expect(members).toHaveLength(0);
    });
  });
});