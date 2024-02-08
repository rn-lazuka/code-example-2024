import { validatorMoreLessNumber } from '@validators';

describe('validatorMoreLessNumber', () => {
  it('should return correct regexp and contain correct message', () => {
    const pattern = validatorMoreLessNumber();
    pattern.value = /^[<,>]?\d+(\.\d+|,\d+)?$/;
    pattern.message = 'common:validation.moreLessNumber';
  });
});
