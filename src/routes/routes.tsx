import type { RouteObject } from 'react-router-dom';
import UsersPage from '../components/pages/UsersPage';
import UserDetailsPage from '../components/pages/UserDetailsPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <UsersPage />,
  },
  {
    path: '/user/:userId',
    element: <UserDetailsPage />,
  },
];