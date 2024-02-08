import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render } from '@unit-tests';
import { PatientsFilterChips } from '@components/pages/PatientsOverview';
import { PatientIsolationFilterNames } from '@enums';
import { act } from 'react-dom/test-utils';

const allIsolatorFilters = {
  items: [
    { name: PatientIsolationFilterNames.hiv, checked: true },
    { name: PatientIsolationFilterNames.hepB, checked: true },
    { name: PatientIsolationFilterNames.hepC, checked: true },
    { name: PatientIsolationFilterNames.normal, checked: true },
  ],
};

const emptyPatientNameFilter = null;
const patientNameFilter = { id: '1', label: 'Test Name' };

describe('PatientsFilterChips', () => {
  const onChipFilterClick = jest.fn();
  const onClearAllClick = jest.fn();
  const user = userEvent.setup();

  it('should render isolation filters chips if checked is true', () => {
    render(
      <PatientsFilterChips
        patientNameFilter={emptyPatientNameFilter}
        allIsolatorFilters={allIsolatorFilters}
        onChipFilterClick={onChipFilterClick}
        onClearAllClick={onClearAllClick}
      />,
    );
    expect(screen.getByTestId('HIV-filterChip')).toBeInTheDocument();
    expect(screen.getByTestId('HEP_B-filterChip')).toBeInTheDocument();
    expect(screen.getByTestId('HEP_C-filterChip')).toBeInTheDocument();
    expect(screen.getByTestId('NORMAL-filterChip')).toBeInTheDocument();
    expect(screen.getByTestId('clearAllFilterChip')).toBeInTheDocument();
  });

  it('should render patient name filter, if name is selected', () => {
    render(
      <PatientsFilterChips
        patientNameFilter={patientNameFilter}
        allIsolatorFilters={allIsolatorFilters}
        onChipFilterClick={onChipFilterClick}
        onClearAllClick={onClearAllClick}
      />,
    );

    expect(screen.getByTestId(`${patientNameFilter.label}-filterChip`)).toBeInTheDocument();
  });

  it('should not render patient name filter, if name is not selected', () => {
    render(
      <PatientsFilterChips
        patientNameFilter={emptyPatientNameFilter}
        allIsolatorFilters={allIsolatorFilters}
        onChipFilterClick={onChipFilterClick}
        onClearAllClick={onClearAllClick}
      />,
    );

    expect(screen.queryByTestId(`${patientNameFilter.label}-filterChip`)).not.toBeInTheDocument();
  });

  it('should delete filter on chip click', async () => {
    render(
      <PatientsFilterChips
        patientNameFilter={emptyPatientNameFilter}
        allIsolatorFilters={allIsolatorFilters}
        onChipFilterClick={onChipFilterClick}
        onClearAllClick={onClearAllClick}
      />,
    );
    await act(() => user.click(screen.getByTestId('HIV-filterChip')));
    expect(onChipFilterClick).toBeCalledTimes(1);
  });

  it('should clear all filters on "Clear all" chip click', async () => {
    render(
      <PatientsFilterChips
        patientNameFilter={emptyPatientNameFilter}
        allIsolatorFilters={allIsolatorFilters}
        onChipFilterClick={onChipFilterClick}
        onClearAllClick={onClearAllClick}
      />,
    );
    await act(() => user.click(screen.getByTestId('clearAllFilterChip')));
    expect(onClearAllClick).toBeCalledTimes(1);
  });

  it('should hide ship if checked is false', async () => {
    allIsolatorFilters.items[0].checked = false;
    render(
      <PatientsFilterChips
        patientNameFilter={emptyPatientNameFilter}
        allIsolatorFilters={allIsolatorFilters}
        onChipFilterClick={onChipFilterClick}
        onClearAllClick={onClearAllClick}
      />,
    );
    expect(screen.queryByTestId('HIV-filterChip')).toBeNull();
    expect(screen.getByTestId('HEP_B-filterChip')).toBeInTheDocument();
    expect(screen.getByTestId('HEP_C-filterChip')).toBeInTheDocument();
    expect(screen.getByTestId('NORMAL-filterChip')).toBeInTheDocument();
    expect(screen.getByTestId('clearAllFilterChip')).toBeInTheDocument();
  });
});
