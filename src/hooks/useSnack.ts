import { useAppDispatch } from './storeHooks';
import { addSnack, clearSnack } from '@store/slices/snackSlice';
import type { SnackState } from '@types';

export const useSnack = () => {
  const dispatch = useAppDispatch();

  const displaySnack = (snack: SnackState) => {
    dispatch(addSnack(snack));
  };

  const hideSnack = () => {
    dispatch(clearSnack());
  };

  return { displaySnack, hideSnack } as const;
};
