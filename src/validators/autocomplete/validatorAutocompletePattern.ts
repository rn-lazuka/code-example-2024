interface Pattern {
  value: string | RegExp;
  message: string;
}

export const validatorAutocompletePattern =
  (pattern: Pattern, field = 'label') =>
  (data) => {
    const value = data?.[field] ?? data?.label;
    return !value || (value && new RegExp(pattern.value).test(value)) ? true : pattern.message;
  };
