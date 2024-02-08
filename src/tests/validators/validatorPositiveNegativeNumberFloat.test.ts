import { positiveNegativeNumbersFloatReg } from '@src/regexp';
import { validatorPositiveNegativeNumberFloat } from '@validators';

describe('validatorPositiveNegativeNumberFloat', () => {
  it('should return correct regexp and contain correct message', () => {
    const pattern = validatorPositiveNegativeNumberFloat();
    pattern.value = positiveNegativeNumbersFloatReg;
    pattern.message = 'common:validation.numbersField';
  });
});
