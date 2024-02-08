import { rest } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@unit-tests/server/serverMock';
import { getTestStore, RenderHookWrapper } from '@unit-tests';
import { useGetNursesOptions } from '@hooks/useGetNursesOptions';

const nurses = [
  { id: '1', name: 'Nurse 1', userId: 'user1' },
  { id: '2', name: 'Nurse 2', userId: 'user2' },
];
const expectedOptions = nurses.map((nurse) => ({
  label: nurse.name,
  value: nurse.id,
  userId: nurse.userId,
}));
const user = { id: 'user1' };
const store = getTestStore({
  user: {
    user,
  },
});

describe('useGetNursesOptions', () => {
  it('should call the API to get the nurses list and set the nursesOptions state', async () => {
    server.use(
      rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/nurses`, (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(nurses));
      }),
    );
    const { result } = renderHook(() => useGetNursesOptions(), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });
    expect(result.current.nursesOptions).toEqual([]);
    await waitFor(() => {
      expect(result.current.nursesOptions).toEqual(expectedOptions);
    });
  });

  it('should set the administeredBy field value with the Option object if optionValue is true', async () => {
    server.use(
      rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/nurses`, (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(nurses));
      }),
    );
    const setValueMock = jest.fn();
    renderHook(() => useGetNursesOptions(setValueMock, true), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });
    await waitFor(() => {
      expect(setValueMock).toHaveBeenCalledWith('administeredBy', {
        label: 'Nurse 1',
        value: '1',
      });
    });
  });

  it('should set the administeredBy field value with the nurse id if optionValue is false', async () => {
    server.use(
      rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/nurses`, (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(nurses));
      }),
    );
    const setValueMock = jest.fn();
    renderHook(() => useGetNursesOptions(setValueMock, false), {
      wrapper: ({ children }) => RenderHookWrapper({ store, children }),
    });
    await waitFor(() => {
      expect(setValueMock).toHaveBeenCalledWith('administeredBy', '1');
    });
  });
});
