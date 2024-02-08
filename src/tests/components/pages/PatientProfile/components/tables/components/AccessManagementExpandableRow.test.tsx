import { screen } from '@testing-library/dom';
import { render } from '@unit-tests';
import { accessManagementFixture, userFixture } from '@unit-tests/fixtures';
import { AccessManagementExpandableRow } from '@components/pages/PatientProfile';

describe('Access management expandable row', () => {
  it('should render expandable row', () => {
    render(<AccessManagementExpandableRow {...accessManagementFixture[0]} />);

    expect(screen.getByText('tableView.enteredBy')).toBeTruthy();
    expect(screen.getByText('John Boue')).toBeTruthy();
    expect(screen.getByText('29/12/2022')).toBeTruthy();

    expect(screen.getByText('tableView.accessCategory')).toBeTruthy();
    expect(screen.getByText('ACCESS_CATEGORIES:CVC, CVC_CATEGORIES:TEMPORARY, SIDES:RIGHT')).toBeTruthy();

    expect(screen.getByText('tableView.dateOfInsertion')).toBeTruthy();
    expect(screen.getByText('15/12/2022')).toBeTruthy();

    expect(screen.getByText('tableView.instillation')).toBeTruthy();
    expect(screen.getByText('INSTILLATION:HEPARIN_UNITS_ML')).toBeTruthy();

    expect(screen.getByText('tableView.arterial')).toBeTruthy();
    expect(screen.getByText('2.2 modal.ml')).toBeTruthy();

    expect(screen.getByText('tableView.venous')).toBeTruthy();
    expect(screen.getByText('2.1 modal.ml')).toBeTruthy();

    expect(screen.getByText('tableView.comments')).toBeTruthy();
    expect(screen.getByText('comments')).toBeTruthy();
  });

  it('should render control buttons for active access', () => {
    render(<AccessManagementExpandableRow {...accessManagementFixture[0]} />, {
      preloadedState: { user: { user: userFixture() } },
    });
    expect(screen.getByText('button.edit')).toBeTruthy();
    expect(screen.getByText('button.delete')).toBeTruthy();
  });

  it('should hide control buttons for discontinued access', () => {
    render(<AccessManagementExpandableRow {...accessManagementFixture[1]} />, {
      preloadedState: { user: { user: userFixture() } },
    });
    expect(screen.queryByText('button.edit')).toBeNull();
    expect(screen.queryByText('button.delete')).toBeNull();
  });
});
