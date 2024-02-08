import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { CardDataRow } from '@components/DataRow/CardDataRow';

describe('CardDataRow', () => {
  it('should render the component with provided props', () => {
    const isXs = true;
    const name = 'Name';
    const value = 'Value';
    const additionalValue = 'Additional Value';

    render(<CardDataRow isXs={isXs} name={name} value={value} additionalValue={additionalValue} />);

    const nameElement = screen.getByText(name);
    const valueElement = screen.getByText(value);
    const additionalValueElement = screen.getByText(additionalValue);

    expect(nameElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(additionalValueElement).toBeInTheDocument();
  });
});
