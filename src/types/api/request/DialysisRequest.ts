export interface HdReadingRecordsRequest {
  time: string;
  systolicBp: number;
  diastolicBp: number;
  hr: string;
  ap: string;
  vp: number;
  tmp: number;
  ufRate: number;
  qb: number;
  qd: number;
  cumHeparin?: number;
  cumUf: number;
  totalUf?: number;
  conductivity: number;
  dialysateTemp: number;
  heparinRate: number;
  ktV?: number;
  urr?: number;
  duringHdNotes?: string;
  signedBy: string;
  bay: string;
}
