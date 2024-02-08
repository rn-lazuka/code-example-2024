import { renderHook } from '@testing-library/react';
import { rest } from 'msw';
import { useProtectedImageDownloader } from '@hooks';
import { getTestStore, RenderHookWrapper } from '@unit-tests/_utils';
import { server } from '@unit-tests/server/serverMock';

describe('useProtectedImageDownloader', () => {
  const store = getTestStore({});
  const url = 'https://test.com';
  const path = '/pictures/test-image';
  const fullPath = `${url}${path}`;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
      writable: true,
    });
  });

  it('should perform a success request and return url', async () => {
    server.use(
      rest.get(`${fullPath}`, (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(''));
      }),
    );
    const { result } = renderHook(() => useProtectedImageDownloader(), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });

    let imageSrc = await result.current(path);
    expect(imageSrc).toEqual('');
  });

  it('should perform a failed request and return an empty string', async () => {
    server.use(
      rest.get(`${fullPath}`, (req, res, ctx) => {
        return res.once(ctx.status(404), ctx.json(''));
      }),
    );
    const { result } = renderHook(() => useProtectedImageDownloader(), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });

    let imageSrc = await result.current(path);
    expect(imageSrc).toEqual('');
  });
});
