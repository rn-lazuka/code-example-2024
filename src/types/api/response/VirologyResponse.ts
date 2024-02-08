import { VaccinationDossingSchedule } from '@enums/global';

export interface VirologyResponse {
  id: number;
  hbsag: string;
  hbsab: string;
  antiHcv: string;
  antiHiv: string;
  vaccineAmount: number;
  vaccineDossingSchedule: VaccinationDossingSchedule;
  note: string;
  createdAt: string;
}
