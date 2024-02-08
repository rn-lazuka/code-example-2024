import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import { useEffect } from 'react';

const ChildComponent = () => <div data-testid="childComponent"></div>;

const ChildComponentWithError = () => {
  useEffect(() => {
    const nonExistentMethod = null;
    (nonExistentMethod as any)();
  }, []);

  return <></>;
};

describe('RemoteErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ChildComponent />
      </ErrorBoundary>,
    );
    const childElement = screen.getByTestId('childComponent');
    expect(childElement).toBeInTheDocument();
  });

  it('renders ModuleNotLoaded when an error occurs', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div data-testid="fallback"></div>}>
        <ChildComponentWithError />
      </ErrorBoundary>,
    ),
      expect(console.error).toHaveBeenCalled();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();

    (console.error as any)?.mockRestore();

    return;
  });
});
