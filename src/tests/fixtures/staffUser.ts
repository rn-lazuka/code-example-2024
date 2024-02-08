import { Staff, StaffEntity } from '@types';
import { FileTypes, PatientDocumentType } from '@enums/global';

export const staffEntityFixture = (data?: Partial<StaffEntity>): StaffEntity => ({
  id: 1,
  name: 'Test staff name1',
  photoPath: '/patients/photos/10000/31352.jpg',
  document: {
    type: PatientDocumentType.NRIC,
    number: 'Gi5IAIB0GFt7439vLm5N',
  },
  gender: {
    code: 'male',
    extValue: 'kimk',
  },
  roles: ['Doctor', 'FDA'],
  specialities: ['Nephrologist', 'PIC'],
  ...data,
});

export const staffUserFixture = (data?: Partial<Staff>): Staff => ({
  id: 123,
  name: 'Dr Dre',
  photoPath: '/patients/photos/10000/31352.jpg',
  document: {
    type: PatientDocumentType.NRIC,
    number: 'Gi5IAIB0GFt7439vLm5N',
  },
  gender: {
    code: 'male',
    extValue: '',
  },
  roles: ['Doctor', 'FDA'],
  specialities: ['Nephrologist', 'PIC'],
  address: 'address',
  files: [
    {
      name: 'idDocument.pdf',
      type: FileTypes.IdentityDocument,
      id: 123,
      createAt: '2022-03-11',
      size: 122334,
      tempKey: 'dawdaw',
      error: { code: 'any', id: '1', description: 'test' },
    },
    {
      name: 'registration.pdf',
      type: FileTypes.IdentityDocument,
      id: 124,
      createAt: '2022-03-11',
      size: 255434,
      tempKey: 'ddaaad',
      error: { code: 'any', id: '2', description: 'test' },
    },
  ],
  email: 'dre777@gmail.com',
  login: 'doolitldre',
  phone: { countryCode: '+65', number: '85556307' },
  profRegNumber: 'J234MN10-0245',
  ...data,
});
