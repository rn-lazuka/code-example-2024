import type { AppointmentTableItem } from '@types';
import uniqid from 'uniqid';
import { DialysisStatus, Virus } from '@enums';
import { PatientStatuses } from '@enums';

export const appointmentFixture = (data: Partial<AppointmentTableItem> = {}): AppointmentTableItem => {
  return {
    id: uniqid(),
    dialysisId: Math.random() * 10,
    name: {
      id: Math.random() * 10,
      name: 'Test User',
      photoPath: '#',
    },
    hdProgress: {
      patientId: 1,
      appointmentId: 1,
    },
    bay: `Bay Uniq Id`,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    isolation: [Virus.Anti_Hcv, Virus.Hbsab],
    patientStatus: PatientStatuses.Permanent,
    status: DialysisStatus.CheckIn,
    tags: [],
    ...data,
  };
};
