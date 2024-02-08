import {
  AppointmentsContentResponse,
  AppointmentsStatusesFilterCountersResponse,
  AppointmentsStatusesFilterItem,
} from '@types';
import { VirusStatus, AppointmentsStatusesFilters, AppointmentStatus, DialysisStatus } from '@enums';

export const convertAppointmentsToTableFormat = (data: AppointmentsContentResponse[]) => {
  return data.map(({ patientName, isolation, patientId, photoPath, ...appointment }) => ({
    ...appointment,
    name: {
      id: patientId,
      name: patientName,
      photoPath: photoPath,
    },
    isolation:
      Object.entries(isolation).length > 0
        ? Object.entries(isolation)
            .filter(([virus, status]) => status === VirusStatus.Reactive)
            .map(([virus]) => virus)
        : null,
    hdProgress: {
      patientId,
      appointmentId: appointment.id,
    },
    status:
      appointment.status === AppointmentStatus.ServiceEncountered ? DialysisStatus.PreDialysis : appointment.status,
  }));
};

export const setAppointmentsStatusesBadges = (
  counters: AppointmentsStatusesFilterCountersResponse,
  statusesFilters: AppointmentsStatusesFilterItem[],
) => {
  const setBadge = (patientStatus: AppointmentsStatusesFilters) => {
    switch (patientStatus) {
      case AppointmentsStatusesFilters.Waitlist:
        return counters.waitList;
      case AppointmentsStatusesFilters.InProgress:
        return counters.inProgress;
      case AppointmentsStatusesFilters.Cancelled:
        return counters.cancelled;
      case AppointmentsStatusesFilters.Complete:
        return counters.completed;
      case AppointmentsStatusesFilters.All:
        return Object.keys(counters).reduce((acc, item) => {
          return acc + counters[item];
        }, 0);
      default:
        return 0;
    }
  };
  return statusesFilters.map((item) => ({ ...item, badge: setBadge(item.name)?.toString() }));
};
