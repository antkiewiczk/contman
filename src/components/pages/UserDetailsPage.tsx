import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUsersStore } from '../../store';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Kittens } from '../features/Kittens';
import { RandomNumber } from '../features/RandomNumber';
import { Company } from '../features/Company';
import { formatDate } from '../../utils/helpers';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { 
    getUserById, 
    getCompaniesByUserId, 
    getAccessibleFeatures,
    isLoading,
    fetchUserData
  } = useUsersStore();

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId, fetchUserData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [userId]);

  const user = userId ? getUserById(userId) : undefined;
  const companies = userId ? getCompaniesByUserId(userId) : [];
  const accessibleFeatures = userId ? getAccessibleFeatures(userId) : [];

  // Show loading spinner while fetching data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
        <p className="text-gray-600 mb-4">
          User with ID "{userId}" could not be found.
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Users
        </Link>
      </div>
    );
  }

  const renderFeatureComponent = (feature: string) => {
    switch (feature) {
      case 'kittens':
        return <Kittens key="kittens" userId={user.id} />;
      case 'random-number':
        return <RandomNumber key="random-number" userId={user.id} />;
      case 'company':
        return <Company key="company" userId={user.id} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <div className="text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-32 w-32 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 mt-1">ID: {user.id}</p>
              <p className="text-gray-500 text-sm mt-2">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Companies</h3>
              {companies.length > 0 ? (
                <ul className="space-y-3">
                  {companies.map((company) => (
                    <li key={company.id} className="p-3 bg-gray-50 rounded">
                      <div className="font-medium text-gray-900">
                        {company.name}
                      </div>
                      {company.features && company.features.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-600 mb-1">Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {company.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Not a member of any companies.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Accessible Features
            </h2>
            <p className="text-gray-600">
              Features available to {user.name} through their company memberships
            </p>
          </div>

          {accessibleFeatures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accessibleFeatures.map((feature) => (
                <Card key={feature}>
                  {renderFeatureComponent(feature)}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-600">
                  This user doesn't have access to any features through their company memberships.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;