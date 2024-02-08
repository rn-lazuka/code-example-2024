import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';
import { render } from '@unit-tests';
import { FormTimeDurationPicker } from '@components/FormComponents/FormTimeDurationPicker';

describe('FormTimeDurationPicker', () => {
  const label = 'Test';
  const name = 'testName';
  const user = userEvent.setup();

  it('should render the component and open popup', async () => {
    let timeData;
    const defaultValue = 120;
    const TestComponent = () => {
      const { handleSubmit, trigger, watch, ...rest } = useForm({
        defaultValues: {
          testName: defaultValue,
        },
      });
      return (
        <div data-testid="wrapper">
          <form data-testid="form" onSubmit={handleSubmit((data) => (timeData = data[name]))}>
            <FormTimeDurationPicker {...rest} trigger={trigger} watch={watch} name={name} label={label} />
            <button data-testid="formSubmit">Submit</button>
          </form>
        </div>
      );
    };

    const { container } = render(<TestComponent />);
    expect(screen.getByTestId(`wrapper`)).toBeVisible();
    expect(screen.getByTestId(`${name}TimeDurationPicker`)).toBeVisible();
    expect(screen.getByTestId(`${name}TimeDurationPickerIconButton`)).toBeVisible();

    await act(() => user.click(screen.getByTestId('formSubmit')));
    await act(() => user.click(screen.getByTestId(`${name}TimeDurationPickerIconButton`)));

    expect(screen.getByTestId('popover-testName-duration-timepicker')).toBeVisible();

    await act(() => user.click(screen.getByTestId('popover-testName-duration-timepicker')));

    expect(container.querySelector('#popover-durationMin-duration-timepicker')).toBeFalsy();
    expect(timeData).toEqual(defaultValue);
  });
});
