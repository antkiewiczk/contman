import { render, screen } from '@testing-library/react';
import { Kittens } from './Kittens';

describe('Kittens', () => {
  it('renders with userId and companyId', () => {
    render(<Kittens userId="1" companyId="2" />);
    
    expect(screen.getByText('Kittens')).toBeInTheDocument();
    expect(screen.getByText(/Random kitten for user 1/)).toBeInTheDocument();
    expect(screen.getByText(/in company 2/)).toBeInTheDocument();
    expect(screen.getByText('Powered by placekittens.com')).toBeInTheDocument();
  });

  it('renders with userId only', () => {
    render(<Kittens userId="1" />);
    
    expect(screen.getByText('Kittens')).toBeInTheDocument();
    expect(screen.getByText(/Random kitten for user 1/)).toBeInTheDocument();
    expect(screen.queryByText(/in company/)).not.toBeInTheDocument();
  });

  it('shows loading spinner initially', () => {
    render(<Kittens userId="1" />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('generates correct image URL based on userId', () => {
    render(<Kittens userId="1" />);
    
    const img = screen.getByAltText('Random kitten');
    expect(img).toHaveAttribute('src', 'https://placekittens.com/400/300?image=1');
  });

  it('handles different userId values', () => {
    render(<Kittens userId="101" />);
    
    const img = screen.getByAltText('Random kitten');
    // 101 % 100 = 1
    expect(img).toHaveAttribute('src', 'https://placekittens.com/400/300?image=1');
  });
});