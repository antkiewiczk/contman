import { render, screen, act } from '@testing-library/react';
import { RandomNumber } from './RandomNumber';

describe('RandomNumber', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with userId and companyId', () => {
    render(<RandomNumber userId="1" companyId="2" />);
    
    expect(screen.getByText('Random Number')).toBeInTheDocument();
    expect(screen.getByText(/For user 1/)).toBeInTheDocument();
    expect(screen.getByText(/in company 2/)).toBeInTheDocument();
    expect(screen.getByText('Updates every 10 seconds')).toBeInTheDocument();
  });

  it('renders with userId only', () => {
    render(<RandomNumber userId="1" />);
    
    expect(screen.getByText('Random Number')).toBeInTheDocument();
    expect(screen.getByText(/For user 1/)).toBeInTheDocument();
    expect(screen.queryByText(/in company/)).not.toBeInTheDocument();
  });

  it('displays a random number between 0 and 999', () => {
    render(<RandomNumber userId="1" />);
    
    // Find the number in the large text element
    const numberContainer = screen.getByText('Random Number').parentElement;
    const numberElement = numberContainer?.querySelector('.text-5xl');
    expect(numberElement).toBeInTheDocument();
    
    const number = parseInt(numberElement?.textContent || '0');
    expect(number).toBeGreaterThanOrEqual(0);
    expect(number).toBeLessThan(1000);
  });

  it('updates the number every 10 seconds', () => {
    const initialNumber = 123;
    jest.spyOn(Math, 'random').mockReturnValueOnce(initialNumber / 1000);
    
    render(<RandomNumber userId="1" />);
    
    const initialDisplay = screen.getByText(initialNumber.toString());
    expect(initialDisplay).toBeInTheDocument();

    // Mock a different random number
    const newNumber = 456;
    jest.spyOn(Math, 'random').mockReturnValueOnce(newNumber / 1000);

    // Advance timers by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText(newNumber.toString())).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    const { unmount } = render(<RandomNumber userId="1" />);
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});