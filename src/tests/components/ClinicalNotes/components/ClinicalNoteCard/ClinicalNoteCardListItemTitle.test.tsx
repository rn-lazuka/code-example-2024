import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { ClinicalNoteCardListItemTitle } from '@components/ClinicalNotes/components/ClinicalNoteCard/ClinicalNoteCardListItemTitle';

describe('ClinicalNoteCardListItemTitle', () => {
  it('should render text', () => {
    render(<ClinicalNoteCardListItemTitle text="Test text" />);

    expect(screen.getByText('Test text')).toBeInTheDocument();
  });
});
