import { latinLettersSpecialSymbolsReg } from '@src/regexp';
import { validatorLatinLettersSpecialSymbols } from '@validators';

describe('validatorLatinLettersSpecialSymbols', () => {
  it('should return an object with the correct value and message', () => {
    const expectedResult = {
      value: latinLettersSpecialSymbolsReg,
      message: `common:validation.name`,
    };
    expect(validatorLatinLettersSpecialSymbols()).toEqual(expectedResult);
  });
});
