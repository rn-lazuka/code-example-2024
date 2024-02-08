import { AccessManagementResponse } from '@types';

export interface PreDialysisResponse {
  id?: string;
  initial: {
    bayNumber: string;
    treatmentNumber: number;
    today: string;
    duration: string;
  };
  weight: {
    preWeight: number;
    lastWeight: number;
    idwg: number;
    dryWeight: number;
    weightDifference: number;
    reinfusionVolume: number;
    flushesInfusion: number;
    ufTarget: number;
  };
  indicators: {
    standingSystolicBloodPressure: number;
    standingDiastolicBloodPressure: number;
    standingPulse: number;
    sittingSystolicBloodPressure: number;
    sittingDiastolicBloodPressure: number;
    sittingPulse: number;
    bodyTemperature: number;
  };
  patientCondition: string;
  accessManagement: AccessManagementResponse;
  accessCondition: string;
  dialyzer: {
    dialyzerBrand: string;
    surfaceArea: number;
    primedBy: string;
    dialyzerReuseNum?: string;
  };
  notes?: string;
}
