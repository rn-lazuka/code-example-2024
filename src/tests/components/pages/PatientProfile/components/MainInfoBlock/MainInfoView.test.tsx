import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import { render } from '@unit-tests';
import { PatientDocumentType, PatientStatuses } from '@enums';
import { MainInfoView } from '@components/pages/PatientProfile';
import userEvent from '@testing-library/user-event';

const patient = {
  id: 'exampleId',
  name: 'Chuck Norris',
  photoPath: '#',
  status: PatientStatuses.Permanent,
  document: {
    type: PatientDocumentType.NRIC,
    number: 'S1315906H',
  },
  dateBirth: '2022-08-01',
  gender: { code: 'male', extValue: 'my own gender' },
  educationLevel: 'nil',
  occupation: '1001',
  race: 'british',
  nationality: 'australian',
  language: {
    code: 'en',
    extValue: 'my own language',
  },
  religion: '1007',
  phone: {
    number: '60457812',
    countryCode: '+65',
  },
  address: {
    houseFlat: '842',
    street: 'Toa Payoh Lorong',
    city: 'Singapure',
    countryIso: 'SG',
    postalCode: 319319,
  },
  comment: 'Absolutely healthy',
};

describe('View of the patient documents', () => {
  const user = userEvent.setup();

  it('should have image if patient has photo link', async () => {
    render(<MainInfoView patient={patient} />);
    const avatar = screen.getByAltText('avatar');
    expect(avatar).toBeTruthy();
  });

  it('avatar should have first letter of the name if patient has no photo link', async () => {
    patient.photoPath = '';
    render(<MainInfoView patient={patient} />);
    const firstLetterOfName = screen.getByText('C');
    expect(firstLetterOfName.textContent).toContainEqual('C');
  });

  it('should show open patient photo modal on avatar click', async () => {
    patient.photoPath = '#';
    render(<MainInfoView patient={patient} />);
    const avatar = screen.getByAltText('avatar');

    await act(() => user.click(avatar));

    const patientPhotoModalTitle = screen.getByText('profile.patientPhoto');
    expect(patientPhotoModalTitle).toBeTruthy();
  });
});
