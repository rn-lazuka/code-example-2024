export const getObjectKeyByValue = (value: string | number, obj) => {
  const entries = Object.entries(obj);
  const result = entries.find(([key, valueTemp]) => valueTemp === value);
  return result ? result[0] : undefined;
};
