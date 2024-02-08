import { LabOrdersStatusFilters } from '@enums';
import { LabOrdersChipCountersResponse } from '@types';

export const setStatusChipCount = (
  status: LabOrdersStatusFilters,
  countsData: LabOrdersChipCountersResponse,
): string => {
  switch (status) {
    case LabOrdersStatusFilters.All:
      return Object.keys(countsData)
        .reduce((acc, dataKey) => {
          return acc + countsData[dataKey];
        }, 0)
        .toString();
    case LabOrdersStatusFilters.Completed:
      return countsData.completed.toString();
    case LabOrdersStatusFilters.Draft:
      return countsData.draft.toString();
    case LabOrdersStatusFilters.Omitted:
      return countsData.omitted.toString();
    case LabOrdersStatusFilters.Pending:
      return countsData.pending.toString();
    case LabOrdersStatusFilters.ToPerform:
      return countsData.toPerform.toString();
    case LabOrdersStatusFilters.ToSubmit:
      return countsData.toSubmit.toString();
    default:
      return '0';
  }
};
