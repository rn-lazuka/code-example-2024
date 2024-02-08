interface Pattern {
  value: string | RegExp;
  message: string;
}

export const validatorInputPattern = (pattern: Pattern) => (value) => {
  return !value || (value && new RegExp(pattern.value).test(value)) ? true : pattern.message;
};
