import { IsolationGroupsResponse } from '@types';

export const defaultIsolationGroupsResponse: IsolationGroupsResponse = [
  {
    id: 1,
    name: 'Non-Infections',
    isolations: [],
  },
  {
    id: 2,
    name: 'Iso 1',
    isolations: ['HEP_B'],
  },
];

export const defaultIsolationGroupsDetectResponse = {
  id: 1,
  name: 'Non-infections',
  isolations: [],
};
