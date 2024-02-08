import { positiveNegativeNumbersReg } from '@src/regexp';
import { validatorPositiveNegativeNumberInt } from '@validators';

describe('validatorPositiveNegativeNumberInt', () => {
  it('should return correct regexp and contain correct message', () => {
    const pattern = validatorPositiveNegativeNumberInt();
    pattern.value = positiveNegativeNumbersReg;
    pattern.message = 'common:validation.numbersField';
  });
});
