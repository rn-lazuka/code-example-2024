import { VaccinationResponse } from '@types';
import { DoctorSpecialities, DoctorTypes, VaccinationDossingSchedule, VaccinationStatus } from '@enums/global';

export const vaccinationFixture = (data?): VaccinationResponse => ({
  id: 1,
  prescribedBy: {
    name: 'Test doctor',
    internalDoctorId: 11,
    speciality: DoctorSpecialities.DoctorInCharge,
    source: DoctorTypes.Internal,
  },
  status: VaccinationStatus.Pending,
  administerDate: new Date('2023-01-15T06:25:39.385Z'),
  amount: 2,
  clinic: { name: 'Clinic name', branchId: 123 },
  comments: ['comment'],
  dossingSchedule: VaccinationDossingSchedule.Booster,
  vaccineType: { name: 'Test name', code: 44 },
  enteredBy: { id: 1, name: 'Username' },
  enteredAt: new Date('2023-01-13T06:25:39.385Z'),
  files: [
    {
      id: 100,
      name: 'my_file.jpg',
      type: 'VACCINATION',
      size: 1231232102,
      createAt: '2022-09-29T06:25:39.385Z',
    },
  ],
  prescriptionDate: new Date('2023-01-10T06:25:39.385Z'),
  editedAt: new Date('2023-01-14T06:25:39.385Z'),
  editedBy: { id: 2, name: 'TestUser' },
  ...data,
});
