import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { RemoteErrorBoundary } from '@components/RemoteWrapper/components/RemoteErrorBoundary';
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
      <RemoteErrorBoundary>
        <ChildComponent />
      </RemoteErrorBoundary>,
    );
    const childElement = screen.getByTestId('childComponent');
    expect(childElement).toBeInTheDocument();
  });

  it('renders ModuleNotLoaded when an error occurs', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(RemoteErrorBoundary.prototype, 'componentDidCatch').mockImplementation(() => {});

    render(
      <RemoteErrorBoundary>
        <ChildComponentWithError />
      </RemoteErrorBoundary>,
    );

    const errorBoundary = screen.getByTestId('moduleNotLoaded');
    expect(errorBoundary).toBeInTheDocument();

    (console.error as any)?.mockRestore();
    (RemoteErrorBoundary.prototype.componentDidCatch as any)?.mockRestore();
  });
});
