import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { AutocompleteFreeSoloAsyncMultiple } from '@components';

describe('AutocompleteFreeSoloAsyncMultiple', () => {
  it('renders the component', async () => {
    render(
      <AutocompleteFreeSoloAsyncMultiple
        label="Label"
        onChange={jest.fn()}
        getOptionsUrl="/"
        value={{ value: 'value', label: 'label' }}
        name="test"
      />,
    );

    expect(screen.getByTestId('testAutocompleteFreeSoloAsyncMultiple')).toBeInTheDocument();
  });
});
