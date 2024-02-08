import { DaysOfWeek } from '@enums';

export const countSessionsBetweenDates = (
  startDate: Date | null | string,
  endDate: Date | null | string,
  daysOfWeek: DaysOfWeek[],
) => {
  let sessionCount = 0;
  const days = [
    DaysOfWeek.Sunday,
    DaysOfWeek.Monday,
    DaysOfWeek.Tuesday,
    DaysOfWeek.Wednesday,
    DaysOfWeek.Thursday,
    DaysOfWeek.Friday,
    DaysOfWeek.Saturday,
  ];

  const currentDay = startDate && new Date(startDate);
  const formattedEndDate = endDate && new Date(endDate);
  if (currentDay && formattedEndDate && daysOfWeek) {
    for (currentDay; currentDay <= formattedEndDate; currentDay.setDate(currentDay.getDate() + 1)) {
      if (daysOfWeek.includes(days[currentDay.getDay()])) {
        sessionCount++;
      }
    }
  }
  return sessionCount;
};
