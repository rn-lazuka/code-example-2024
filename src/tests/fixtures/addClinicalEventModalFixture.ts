import { ServiceModalName } from '../../enums';
import { TargetAudience } from '../../enums/components/TargetAudience';

export const addClinicalEventModalFixture = (props?) => {
  return {
    [ServiceModalName.AddClinicalEventModal]: {
      date: null,
      type: undefined,
      isAllDay: true,
      title: '',
      laboratory: null,
      startTime: null,
      endTime: null,
      comment: '',
      targetAudience: TargetAudience.AssignedPatients,
      dialysisRelated: true,
      doctor: null,
      patients: [],
      ...props,
    },
  };
};
