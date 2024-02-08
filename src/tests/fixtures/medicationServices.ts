import type { MedicationsService } from '@types';
import { VaccinationMedicationResolution, MedicationFrequencyUnit } from '@enums';

export const medicationServicesFixture = (data?): MedicationsService => ({
  amount: '10',
  editedAt: '2023-02-22T08:33:34.847361Z',
  id: '386',
  medication: {
    description: 'test description',
    uid: '8EEA069B-E6A0-4608-B71F-50FE6F927943',
    name: 'A2 beta-casein',
  },
  medicationGroup: 'Anti-Cholesterol',
  route: 'Oral',
  frequency: {
    frequency: 1,
    period: 1,
    unit: MedicationFrequencyUnit.Days,
  },
  day: 'day',
  editedBy: {
    id: 'string',
    name: 'string',
  },
  resolution: VaccinationMedicationResolution.Administered,
  comments: 'comment',
  ...data,
});
