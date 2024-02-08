import { act } from 'react-dom/test-utils';
import { useForm } from 'react-hook-form';
import { changeSelectValue, render } from '@unit-tests';
import { FormInputSelect } from '@components';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('FormInputSelect', () => {
  const user = userEvent.setup();

  let form;
  const label = 'test label';
  const name = 'testName';
  const options = [
    {
      label: 'option 1 label',
      value: 'option 1 value',
    },
    {
      label: 'option 2 label',
      value: 'option 2 value',
    },
  ];

  const TestComponent = () => {
    form = useForm({
      defaultValues: {
        [name]: null,
      },
    });
    return <FormInputSelect clearable control={form.control} options={options} name={name} label={label} />;
  };

  it('should render component with test attribute', () => {
    render(<TestComponent />);
    expect(screen.getByTestId(`${name}SelectInput`)).toBeInTheDocument();
  });

  it('should change selected value on select event', async () => {
    render(<TestComponent />);
    expect(form.getValues()[name]).toEqual(null);
    await changeSelectValue(screen.getByTestId(`${name}SelectInput`), options[0].value);
    expect(form.getValues()[name]).toEqual(options[0].value);

    await act(() => user.click(screen.getByTestId('ClearIcon')));

    expect(form.getValues()[name]).toEqual('');
  });
});
