import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { useForm } from 'react-hook-form';
import { render } from '@unit-tests';
import { FormAutocompleteFreeSolo } from '@components/FormComponents/FormAutocompleteFreeSolo';
import { DialyzerUseType } from '@enums';
import userEvent from '@testing-library/user-event';

describe('FormAutoCompleteFreeSolo', () => {
  const label = 'Test';
  const name = 'testName';
  const optionsExample = [
    {
      label: 'Dialyzer1',
      value: 'dialyzer1',
      group: DialyzerUseType.Reuse,
    },
    {
      label: 'Dialyzer2',
      value: 'dialyzer2',
      group: DialyzerUseType.Single,
    },
    {
      label: 'Dialyzer3',
      value: 'dialyzer3',
      group: DialyzerUseType.Single,
    },
  ];
  const user = userEvent.setup();

  it('should render autocomplete with grouped options', async () => {
    const TestComponent = () => {
      const { handleSubmit, ...rest } = useForm({
        defaultValues: {
          [name]: true,
        },
      });
      return (
        <FormAutocompleteFreeSolo
          options={optionsExample}
          {...rest}
          groupBy={(option) => option?.group || ''}
          name={name}
          label={label}
        />
      );
    };
    render(<TestComponent />);
    expect(screen.getByTestId(`${name}AutocompleteFreeSolo`)).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId(`${name}AutocompleteFreeSolo`)));

    expect(screen.getByText('REUSE')).toBeInTheDocument();
    expect(screen.getByText('SINGLE_USE')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(optionsExample.length);
    expect(screen.getAllByRole('option')[0]).toHaveTextContent(optionsExample[0].label);
    expect(screen.getAllByRole('option')[1]).toHaveTextContent(optionsExample[1].label);
  });

  it('should render autocomplete without grouped options', async () => {
    const TestComponent = () => {
      const { handleSubmit, ...rest } = useForm({
        defaultValues: {
          [name]: true,
        },
      });
      return <FormAutocompleteFreeSolo options={optionsExample} {...rest} name={name} label={label} />;
    };

    render(<TestComponent />);
    expect(screen.getByTestId(`${name}AutocompleteFreeSolo`)).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId(`${name}AutocompleteFreeSolo`)));

    expect(screen.queryByText('REUSE')).toBeNull();
    expect(screen.queryByText('SINGLE_USE')).toBeNull();
  });
});
