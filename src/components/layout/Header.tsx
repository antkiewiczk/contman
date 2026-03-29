import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Contman</span>
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>Users</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};