import { render } from '@unit-tests';
import { screen } from '@testing-library/dom';
import RichTableCellSpecialNotes from '@components/RichTable/components/components/RichTableCellSpecialNotes';
import { SpecialNote } from '@enums';

const data: SpecialNote[] = [SpecialNote.AdditionalAttention, SpecialNote.LabAnalysis, SpecialNote.MedicationChanges];

describe('RichTableCellSpecialNotes', () => {
  it('should render icons in cell', () => {
    render(<RichTableCellSpecialNotes specialNotes={data} />);

    expect(screen.getByTestId('EmergencyIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ScienceOutlinedIcon')).toBeInTheDocument();
    expect(screen.getByTestId('MedicationOutlinedIcon')).toBeInTheDocument();
  });

  it('should render empty cell', () => {
    render(<RichTableCellSpecialNotes specialNotes={[]} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
