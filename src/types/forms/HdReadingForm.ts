export interface HdReadingForm {
  time: string | Date;
  systolicBp?: number;
  diastolicBp?: number;
  hr: string;
  ap: string;
  vp?: number;
  tmp?: number;
  ufRate?: number;
  qb?: number;
  qd?: number;
  cumHeparin?: number;
  heparinRate?: number;
  cumUf?: number;
  totalUf?: number;
  conductivity?: number;
  dialysateTemp?: number;
  ktV?: number;
  urr?: number;
  duringHdNotes: string;
  signedBy: { label: string; value: string };
}
