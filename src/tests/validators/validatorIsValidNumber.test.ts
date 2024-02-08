import { validatorIsValidNumber } from '../../validators/validatorIsValidNumber';

describe('validatorMaxFileSize', () => {
  it('should return true if it has valid value', () => {
    expect(validatorIsValidNumber(10)).toBeTruthy();
  });

  it('should return true if it has invalid value', () => {
    expect(validatorIsValidNumber('test')).toEqual('common:validation.decimalsNumbers');
  });
});
