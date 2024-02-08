import { format } from 'date-fns';
import { render } from '@unit-tests';
import { ClinicalNoteCardListItemUserInfo } from '@components/ClinicalNotes/components/ClinicalNoteCard/ClinicalNoteCardListItemUserInfo';
import type { ClinicalNoteCardListItemUserInfoProps } from '@components/ClinicalNotes/components/ClinicalNoteCard/ClinicalNoteCardListItemUserInfo';
import { screen } from '@testing-library/dom';
import { getPersonNameWithDeletedSyfix } from '@utils';

const userMock = {
  id: 1,
  name: 'Test User',
  deleted: false,
};

const propsMock: ClinicalNoteCardListItemUserInfoProps = {
  user: userMock,
  date: new Date(),
};

describe('ClinicalNoteCardListItemUserInfo', () => {
  it('should render not deleted user', () => {
    render(<ClinicalNoteCardListItemUserInfo user={propsMock.user} date={propsMock.date} />);

    expect(screen.getByText(userMock.name)).toBeInTheDocument();
    expect(screen.getByTestId('ClinicalNoteUserLink')).toBeInTheDocument();
  });

  it('should render deleted user', () => {
    render(<ClinicalNoteCardListItemUserInfo user={{ ...propsMock.user, deleted: true }} date={propsMock.date} />);

    expect(screen.getByText(getPersonNameWithDeletedSyfix({ name: userMock.name, deleted: true }))).toBeInTheDocument();
    expect(screen.queryByTestId('ClinicalNoteUserLink')).not.toBeInTheDocument();
  });

  it('should render date', () => {
    render(<ClinicalNoteCardListItemUserInfo user={propsMock.user} date={propsMock.date} />);

    expect(screen.getByText(format(new Date(propsMock.date), 'dd/MM/yyyy hh:mm a'))).toBeInTheDocument();
  });
});
