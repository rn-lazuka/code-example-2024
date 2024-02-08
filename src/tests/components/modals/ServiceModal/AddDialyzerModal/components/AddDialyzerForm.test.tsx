import Button from '@mui/material/Button';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { getTestStoreAndDispatch, render } from '@unit-tests/_utils';
import { act } from 'react-dom/test-utils';
import { useForm } from 'react-hook-form';
import { AddDialyzerForm } from '@components/modals/ServiceModal/components/AddDialyzerModal/AddDialyzerForm';
import { DialyzerUseType } from '@enums';
import type { AddDialyzerFormType } from '@types';

jest.mock('@hooks/useDialyzerOptions', () => ({
  useDialyzerOptions: () => ({
    dialyzerOptions: [
      {
        label: 'LABEL 1',
        value: 'VALUE_1',
        type: DialyzerUseType.Single,
      },
    ],
  }),
}));

describe('AddDialyzerForm', () => {
  const user = userEvent.setup();

  let form;
  let onSubmit;
  let defaultValues: AddDialyzerFormType = {
    useType: DialyzerUseType.Single,
    dialyzerBrand: null,
    dialyzerSurfaceArea: null,
  };

  beforeEach(() => {
    onSubmit = jest.fn();
  });

  const TestComponent = ({
    defaultFormValues = {},
    defaultType = DialyzerUseType.Single,
  }: {
    defaultFormValues?: AddDialyzerFormType | {};
    defaultType?: DialyzerUseType;
  }) => {
    form = useForm<AddDialyzerFormType>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues: { ...defaultValues, ...defaultFormValues },
      shouldUnregister: true,
    });

    return (
      <>
        <AddDialyzerForm control={form.control} watch={form.watch} setValue={form.setValue} defaultType={defaultType} />
        <Button onClick={form.handleSubmit(onSubmit)} data-testid="submitButton">
          SUBMIT
        </Button>
      </>
    );
  };

  it('should render AddDialyzerForm and check all fields', async () => {
    const area = '100';
    const brand = 'brand';
    const { store } = getTestStoreAndDispatch({});

    await act(() => render(<TestComponent />, { store } as any));

    expect(screen.getByTestId('SINGLE_USERadioButton')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerBrandAutocompleteFreeSolo')).toBeInTheDocument();
    expect(screen.getByTestId('dialyzerSurfaceAreaTextInput')).toBeInTheDocument();

    expect(screen.getByTestId('submitButton')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('submitButton')));

    expect(onSubmit).not.toHaveBeenCalled();

    await act(() => user.click(screen.getByTestId('SINGLE_USERadioButton')));
    await act(() => user.type(screen.getByTestId('dialyzerBrandAutocompleteFreeSolo'), brand));
    await act(() => user.type(screen.getByTestId('dialyzerSurfaceAreaTextInput'), area));

    await act(() => user.click(screen.getByTestId('submitButton')));

    expect(onSubmit).toHaveBeenCalled();
  });
});
