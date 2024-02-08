import { ClinicalScheduleEventFilter, ClinicalScheduleEvents } from '@types';

export const filterClinicalScheduleEvents = (
  events: ClinicalScheduleEvents,
  filters: ClinicalScheduleEventFilter[],
) => {
  const selectedFilters = filters.filter(({ selected }) => selected);
  const selectedFilterNames = selectedFilters.map((filter) => filter.name);
  const areFiltersSelected = !!selectedFilters.length;
  if (!areFiltersSelected) {
    return events;
  }
  return Object.entries(events).reduce((acc, [key, value]) => {
    const filteredEvent = Object.entries(value).reduce((filtered, [eventKey, eventList]) => {
      const filteredList = eventList.filter((item) => selectedFilterNames.includes(item.type));
      if (filteredList.length > 0) {
        filtered[eventKey] = filteredList;
      }
      return filtered;
    }, {});

    if (Object.keys(filteredEvent).length > 0) {
      acc[key] = filteredEvent;
    }

    return acc;
  }, {});
};
