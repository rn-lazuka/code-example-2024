import { DoctorRequestType } from '@types';

export interface TreatmentInfoRequest {
  isAmbulant: boolean;
  personInChargeId: number;
  nephrologistId: number;
  referralInfo: {
    status: boolean;
    clinic: string;
    doctor: DoctorRequestType;
  };
  firstDialysis?: string;
  firstCenterDialysis: string;
  comments: string;
  primaryNurseId: number;
}
