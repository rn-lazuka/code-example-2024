import { ClinicalScheduleEventType } from '@enums/pages/Schedule';
import { FormAutocompleteOption } from '@components/FormComponents';
import { TargetAudience } from '@enums/components/TargetAudience';

export interface ClinicalEventFormType {
  date: Date | null;
  type?: ClinicalScheduleEventType;
  isAllDay: boolean;
  title?: string;
  laboratory?: FormAutocompleteOption | null;
  startTime?: Date | null;
  endTime?: Date | null;
  comment: string;
  doctor?: FormAutocompleteOption | null;
  targetAudience?: TargetAudience;
  dialysisRelated?: boolean;
  patient?: FormAutocompleteOption | null;
}
