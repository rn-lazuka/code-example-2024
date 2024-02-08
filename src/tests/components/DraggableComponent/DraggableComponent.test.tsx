import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import { DraggableComponent } from '@components';

describe('DraggableComponent', () => {
  it('should render empty component', () => {
    render(
      <DraggableComponent>
        <div>test</div>
      </DraggableComponent>,
    );

    expect(screen.getByTestId('draggablePaper')).toBeInTheDocument();
    expect(screen.getByTestId('draggablePaper')).toHaveClass('react-draggable');
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
