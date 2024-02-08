import { AddServiceModalPlace, AddHocEventTypes, ServiceModalName } from '@enums';

export const addHocServicesModalFixture = (props?) => {
  return {
    [ServiceModalName.AddHocServicesModal]: {
      type: AddHocEventTypes.HD,
      patient: null,
      date: null,
      shift: null,
      isolationGroupId: 5,
      place: AddServiceModalPlace.SHIFT,
      procedure: null,
      laboratory: null,
      specimenType: null,
      ...props,
    },
  };
};
