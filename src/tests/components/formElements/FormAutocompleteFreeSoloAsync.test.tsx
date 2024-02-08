import { screen } from '@testing-library/dom';
import { useForm } from 'react-hook-form';
import { render } from '@unit-tests';
import { FormAutocompleteFreeSoloAsync } from '@components/FormComponents/FormAutocompleteFreeSoloAsync';

const availableDoctors = [
  {
    name: 'Doctor Test',
    id: 1,
  },
];

describe('FormAutoCompleteFreeSoloAsync', () => {
  const label = 'Test';
  const name = 'testName';

  it('should render autocomplete with grouped options', async () => {
    const TestComponent = () => {
      const { ...rest } = useForm({
        defaultValues: {
          [name]: {
            label: availableDoctors[0].name,
            value: availableDoctors[0].id,
          },
        },
      });
      return <FormAutocompleteFreeSoloAsync getOptionsUrl="/test" {...rest} name={name} label={label} />;
    };
    render(<TestComponent />);
    expect(screen.getByTestId(`${name}AutocompleteFreeSoloAsync`)).toBeInTheDocument();
  });
});
