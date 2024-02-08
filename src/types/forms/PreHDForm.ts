import { AccessCondition, Instillation, NeedleSize, NeedleType, PatientCondition } from '@enums';
import { AutocompleteFreeSoloOptionType } from '@components/autocompletes/AutocompleteFreeSolo/AutocompleteFreeSolo';

export interface AccessForm {
  needleType?: NeedleType;
  arterialNeedleSize?: NeedleSize;
  venousNeedleSize?: NeedleSize;
  instillation?: Instillation;
  instillationExtValue?: string;
  wasUsed?: boolean;
}

export interface PreHDForm {
  initialBayNumber: string;
  initialTreatmentNumber: string | number;
  initialToday: Date;
  initialDuration: string;
  preSessionWeight: { label: string; value: string };
  lastSessionWeight: string;
  idwg: string;
  dryWeight: string;
  weightDifference: string;
  reinfusionVolume: string;
  flushesInfusion: string;
  ufTarget: string;
  standingSystolicBloodPressure: string | number;
  standingDiastolicBloodPressure: string | number;
  standingPulse: string | number;
  sittingSystolicBloodPressure: string | number;
  sittingDiastolicBloodPressure: string | number;
  sittingPulse: string | number;
  bodyTemperature: string | number;
  patientCondition: PatientCondition;
  patientConditionExtValue: string;
  accessCondition: AccessCondition;
  accessConditionExtValue: string;
  access: AccessForm[];
  anticoagulantType: AutocompleteFreeSoloOptionType;
  anticoagulantPrimeDose: string | number;
  anticoagulantBolusDose: string | number;
  anticoagulantHourlyDose: string | number;
  dialysateCalcium: number | string;
  dialysateSodiumStart: number | string;
  dialysateSodiumEnd: number | string;
  dialysatePotassium: number | string;
  dialysateTemperature: number | string;
  dialysateFlow: number | string;
  notes?: string;
  patientDialyzer: { label: string; value: string; history: any[] } | null;
  dialyzerReuseNum: number | string;
  disposeAfterwards: boolean;
  sterilantVe: boolean;
  dialyzerTestedBy: AutocompleteFreeSoloOptionType;
  residualVe: boolean;
  residualTestedBy: AutocompleteFreeSoloOptionType;
  dialyzerPrimedBy: AutocompleteFreeSoloOptionType;
  dialyzerSterilantVeComment: string;
}

export interface StartHdForm {
  startedAt: Date;
}

export interface FinishHdForm {
  endsAt: Date;
}
