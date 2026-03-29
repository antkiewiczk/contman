import { useUsersStore } from '../../store';
import type { FeatureComponentProps } from '../../types';
import { getCompanyMembers } from '../../utils/helpers';

export const Company = ({ userId }: FeatureComponentProps) => {
  const { users, companies } = useUsersStore();
  
  const userCompanies = companies.filter(company => 
    company.users?.includes(userId)
  );

  if (!userCompanies.length) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Companies</h3>
        <p className="text-gray-600">User is not a member of any companies.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Companies</h3>
      <div className="space-y-4">
        {userCompanies.map((company) => {
          const members = getCompanyMembers(company, users);
          
          return (
            <div key={company.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{company.name}</h4>
              
              {members.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Members:</p>
                  <ul className="space-y-1">
                    {members.map((member) => (
                      <li key={member.id} className="flex items-center space-x-2">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm">{member.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No members in this company.</p>
              )}
              
              {company.features && company.features.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Available features:</p>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};