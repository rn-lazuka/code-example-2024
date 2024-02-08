import { DialysisStatus } from '@src/enums';

export interface PatientWeight {
  id: number;
  weighedAt: string;
  weight: number;
  hdStage: DialysisStatus.PreDialysis | DialysisStatus.PostDialysis;
}

export type PatientWeightsResponse = PatientWeight[];
