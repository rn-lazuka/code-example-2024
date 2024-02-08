import { validatorNumberSpecialCharacters } from '@validators/validatorNumberSpecialCharacters';
import { numbersSpecialCharactersReg } from '@src/regexp';

describe('validatorNumberSpecialCharacters', () => {
  it('should return correct regexp and contain correct message', () => {
    const pattern = validatorNumberSpecialCharacters();
    pattern.value = numbersSpecialCharactersReg;
    pattern.message = 'common:validation.latinLetters';
  });
});
