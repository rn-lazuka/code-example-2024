type FieldValue = { label: string; value: string | number | null } | null;

export type IndividualLabTestPlanFormType = {
  patient: FieldValue;
  procedure: FieldValue;
  laboratory: FieldValue;
  specimenType: FieldValue;
  dialysisDay: boolean;
  planeDates: { date: null | Date }[];
};
