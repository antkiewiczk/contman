export type FeatureType = 'kittens' | 'random-number' | 'company';

export interface FeatureComponentProps {
  userId: string;
  companyId?: string;
}

export type FeatureComponent = React.ComponentType<FeatureComponentProps>;