import { AddHocEventTypes, LabSpecimenType } from '@enums/components';

export type AddHocEventFormType = {
  type: AddHocEventTypes;
  patient?: { value: number; label: string } | null;
  labTestPatient?: { value: number; label: string } | null;
  date: Date | null;
  shift?: { value: number; label: string } | null;
  procedure?: { value: number; label: string } | null;
  laboratory?: { value: string; label: string } | null;
  specimenType?: LabSpecimenType;
};
