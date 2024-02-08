import { render } from '@unit-tests';
import { clinicalNoteFixture } from '@unit-tests/fixtures';
import { screen } from '@testing-library/dom';
import { ClinicalNotesList } from '@components/ClinicalNotes/components/ClinicalNotesList';
import { ClinicalNotesPlaces } from '@enums';

describe('ClinicalNotesList', () => {
  it('should render clinical note card', () => {
    render(<ClinicalNotesList place={ClinicalNotesPlaces.Header} />, {
      preloadedState: { clinicalNotes: { clinicalNotes: [clinicalNoteFixture] } },
    });

    expect(screen.getAllByTestId('clinicalNoteCard').length).toBe(1);
  });

  it('should not render component if place is Profile and there is no patient ID', () => {
    render(<ClinicalNotesList place={ClinicalNotesPlaces.Profile} />);

    expect(screen.queryByTestId('ClinicalNotesList')).not.toBeInTheDocument();
  });
});
