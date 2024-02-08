export const changeCommaToDot = (value: string) => {
  return value.replace(',', '.');
};

export const transformEventCommaToDot = (event) => {
  event.target.value = changeCommaToDot(event.target.value);
  return event;
};

export const transformObjectComaToDot = (value: { label: string; value: string }): { label: string; value: string } => {
  const transformedValue = changeCommaToDot(value?.value || '');
  return { label: transformedValue, value: transformedValue };
};
