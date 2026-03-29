import type { Company } from './company';

export interface User {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
}

export interface UserWithCompanies extends User {
  companies: Company[];
  accessibleFeatures: string[];
}