import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '@src/App';
import { store } from '@store';

describe('App tests', () => {
  it('should contains loader', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const loader = container.getElementsByClassName('MuiCircularProgress-root');
    expect(loader.length).toBe(1);
  });
});
