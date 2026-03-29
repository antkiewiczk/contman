import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders card with children', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders card with title', () => {
    render(
      <Card title="Test Title">
        <div>Content</div>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders card with actions', () => {
    render(
      <Card actions={<button>Action</button>}>
        <div>Content</div>
      </Card>
    );

    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    );

    const card = screen.getByText('Content').closest('.bg-white');
    expect(card).toHaveClass('custom-class');
  });
});