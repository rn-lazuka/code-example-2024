import { format } from 'date-fns';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ClinicalNotesFilters } from '@components/ClinicalNotes/components/ClinicalNotesFilters';
import { render } from '@unit-tests';
import { clinicalNotesInitialState } from '@store/slices';
import { act } from 'react-dom/test-utils';
import { ClinicalNotesPlaces } from '@enums';

const { noteTypes } = clinicalNotesInitialState.filters;

describe('ClinicalNotesFilters', () => {
  const user = userEvent.setup();

  it('should render "from date" and "to date" filters with default values and not render "Patient name", if place is Profile', () => {
    render(<ClinicalNotesFilters place={ClinicalNotesPlaces.Profile} />);

    expect(screen.getByTestId('fromDatePicker')).toHaveValue('');
    expect(screen.getByTestId('toDatePicker')).toHaveValue(format(new Date(), 'dd/MM/yyyy'));
    expect(screen.queryByTestId('patientAutocomplete')).not.toBeInTheDocument();
  });

  it('should render chip filters', () => {
    render(<ClinicalNotesFilters place={ClinicalNotesPlaces.Profile} />);

    noteTypes.forEach((item) => {
      expect(screen.getByTestId(`${item.name}Chip`)).toBeInTheDocument();
    });
  });

  it('should render "clear all" chip, if 2 or more chips selected', async () => {
    render(<ClinicalNotesFilters place={ClinicalNotesPlaces.Profile} />);

    await act(() => user.click(screen.getByTestId(`${noteTypes[0].name}Chip`)));
    await act(() => user.click(screen.getByTestId(`${noteTypes[1].name}Chip`)));

    expect(screen.getByTestId('filters.clearAllChip')).toBeInTheDocument();
  });

  it('should render "from date", "to date" and "Patient name" filter, if place is Header', () => {
    render(<ClinicalNotesFilters place={ClinicalNotesPlaces.Header} />);

    expect(screen.getByTestId('fromDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('toDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('patientAutocomplete')).toBeInTheDocument();
  });
});
