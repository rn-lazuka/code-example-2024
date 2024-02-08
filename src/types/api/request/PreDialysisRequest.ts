import { CvcAccessManagementResponse, VascularAccessManagementResponse } from '@types';
import { DialysisSubmitSource, SterilantVe } from '@enums';

export interface PreDialysisRequest {
  initial: {
    locationId: string;
    treatmentNumber: string | number;
    dialysisDate: string;
    duration: string;
  };
  calculations: {
    preSessionWeight: string;
    lastSessionWeight: string;
    idwg: string;
    dryWeight: string;
    weightDifference: string;
    reinfusionVolume: string;
    infusion: string;
    ufTarget: string;
  };
  indicators: {
    standingSystolicBloodPressure: string | number;
    standingDiastolicBloodPressure: string | number;
    standingPulse: string | number;
    sittingSystolicBloodPressure: string | number;
    sittingDiastolicBloodPressure: string | number;
    sittingPulse: string | number;
    bodyTemperature: string | number;
  };
  patientCondition: string;
  accessManagements: (CvcAccessManagementResponse | VascularAccessManagementResponse)[];
  accessCondition: string;
  dialyzer: {
    id: string;
    primedBy: string;
    beforeSterilant?: {
      test: SterilantVe.NEG_VE;
      testedBy: string;
    } | null;
    afterSterilant?: {
      test: SterilantVe.POS_VE;
      testedBy: string;
    } | null;
    comment: string;
    disposeAfterwards: boolean;
  };
  anticoagulant: {
    type: string;
    primeDose: string | number;
    bolusDose: string | number;
    hourlyDose: string | number;
  };
  dialysate: {
    calcium: number | string;
    sodiumStart: number | string;
    sodiumEnd: number | string;
    potassium: number | string;
    temperature: number | string;
    flow: number | string;
  };
  notes?: string;
  source: DialysisSubmitSource;
}
