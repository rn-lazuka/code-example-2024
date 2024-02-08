import { HorizontalScrollContainer } from '@components';
import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';

describe('HorizontalScrollContainer', () => {
  it('renders children', () => {
    render(
      <HorizontalScrollContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </HorizontalScrollContainer>,
    );
    const component = screen.getByTestId('horizontalScrollContainer');
    expect(component).toBeInTheDocument();
    expect(component.childNodes.length).toBe(2);
  });

  it('renders with nowrap when nowrap prop is true', () => {
    render(
      <HorizontalScrollContainer nowrap>
        <div>Child 1</div>
        <div>Child 2</div>
      </HorizontalScrollContainer>,
    );
    const component = screen.getByTestId('horizontalScrollContainer');
    expect(component).toHaveStyle('white-space: nowrap');
    expect(component).toHaveStyle('display: flex');
    expect(component).toHaveStyle('overflowY: hidden');
    expect(component).toHaveStyle('overflowX: auto');
  });
});
