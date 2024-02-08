const sortValues = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  OTHER: 7,
};

export const joinAndSortFrequencyDays = (days: string[] = [], symbol = '_', shouldSlice = true) => {
  const sortedDays = [...days].sort((a, b) => {
    const dayValue1 = sortValues[a] || sortValues.OTHER;
    const dayValue2 = sortValues[b] || sortValues.OTHER;
    return dayValue1 - dayValue2;
  });
  return shouldSlice ? sortedDays.map((day) => day.slice(0, 3)).join(symbol) : sortedDays.join(symbol);
};
