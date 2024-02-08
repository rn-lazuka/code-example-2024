interface Pattern {
  value: number;
  message: string;
}

export const validatorMaxLengthPattern = (pattern: Pattern) => (value) => {
  return !value || (value && pattern.value >= value.length) ? true : pattern.message;
};
