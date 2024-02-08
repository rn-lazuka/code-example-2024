import { DoctorSpecialities } from '@enums';

export const defaultDoctorsResponse = [
  {
    name: 'Doctor Test!!!',
    userId: 1,
    specialities: [
      {
        id: 1,
        name: DoctorSpecialities.DoctorNephrologist,
      },
    ],
  },
];
