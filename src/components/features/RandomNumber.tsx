import { useState, useEffect } from 'react';
import type { FeatureComponentProps } from '../../types';

export const RandomNumber = ({ userId, companyId }: FeatureComponentProps) => {
  const [number, setNumber] = useState<number>(() => Math.floor(Math.random() * 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNumber(Math.floor(Math.random() * 1000));
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Random Number</h3>
      <div className="text-center">
        <div className="text-5xl font-bold text-primary-600 mb-2">{number}</div>
        <p className="text-sm text-gray-600">
          Updates every 10 seconds
        </p>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        For user {userId}
        {companyId && ` in company ${companyId}`}
      </p>
    </div>
  );
};