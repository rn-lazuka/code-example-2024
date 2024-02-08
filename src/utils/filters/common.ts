type combineFiltersList = ((value: any) => boolean)[];

export const combineFilters = (...filters: combineFiltersList) => {
  return (value: any) => filters.every((filter) => filter(value));
};
