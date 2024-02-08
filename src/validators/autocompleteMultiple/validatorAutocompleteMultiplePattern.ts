interface Pattern {
  value: string | RegExp;
  message: string;
}

export const validatorAutocompleteMultiplePattern = (pattern: Pattern) => (data) => {
  return data.every((value) => new RegExp(pattern.value).test(value)) ? true : pattern.message;
};
