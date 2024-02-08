import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { ClinicalNoteCard } from '@components/ClinicalNotes/components/ClinicalNoteCard/ClinicalNoteCard';
import { clinicalNoteFixture } from '@unit-tests/fixtures';
import { ClinicalNotesPlaces } from '@enums';

describe('ClinicalNoteCard', () => {
  it('should correctly render type and details, when there are no details', () => {
    render(<ClinicalNoteCard data={clinicalNoteFixture} place={ClinicalNotesPlaces.Profile} />);

    expect(screen.getByText(`filters.noteTypes.${clinicalNoteFixture.type}`)).toBeInTheDocument();
    expect(screen.queryByText(`filters.noteTypes.${clinicalNoteFixture.type} — `)).not.toBeInTheDocument();
  });

  it('should correctly render type and details, when there are details data', () => {
    render(
      <ClinicalNoteCard
        data={{ ...clinicalNoteFixture, details: 'Test details' }}
        place={ClinicalNotesPlaces.Profile}
      />,
    );

    expect(screen.getByText(`filters.noteTypes.${clinicalNoteFixture.type} — Test details`)).toBeInTheDocument();
  });

  it('should render only "enteredBy", if there is no editedBy', () => {
    render(<ClinicalNoteCard data={clinicalNoteFixture} place={ClinicalNotesPlaces.Profile} />);

    expect(screen.getByText(clinicalNoteFixture.enteredBy.name)).toBeInTheDocument();
    expect(screen.queryByText(`${clinicalNoteFixture.editedBy?.name}`)).not.toBeInTheDocument();
  });

  it.skip('should render both "enteredBy" and "editedBy"', () => {
    render(
      <ClinicalNoteCard
        data={{ ...clinicalNoteFixture, editedBy: { id: 3, name: 'Edited By Name', deleted: false } }}
        place={ClinicalNotesPlaces.Profile}
      />,
    );

    expect(screen.getByText('Edited By Name')).toBeInTheDocument();
    expect(screen.getByText(clinicalNoteFixture.enteredBy.name)).toBeInTheDocument();
  });

  it('should render "note"', () => {
    render(<ClinicalNoteCard data={clinicalNoteFixture} place={ClinicalNotesPlaces.Profile} />);

    expect(screen.getByText(clinicalNoteFixture.note)).toBeInTheDocument();
  });

  it('should render patient info, when place is Header', () => {
    render(<ClinicalNoteCard data={clinicalNoteFixture} place={ClinicalNotesPlaces.Header} />);

    expect(screen.getByText(clinicalNoteFixture.patient.name)).toBeInTheDocument();
  });

  it('should not render patient info, when place is Profile', () => {
    render(<ClinicalNoteCard data={clinicalNoteFixture} place={ClinicalNotesPlaces.Profile} />);

    expect(screen.queryByText(clinicalNoteFixture.patient.name)).not.toBeInTheDocument();
  });
});
