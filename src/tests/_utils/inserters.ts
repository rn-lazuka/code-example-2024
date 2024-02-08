import { waitFor } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

export const changeSelectValue = async (element: HTMLElement, value: string) => {
  const select = await waitFor(() => element);
  await act(() => fireEvent.change(select, { target: { value } }));
};
