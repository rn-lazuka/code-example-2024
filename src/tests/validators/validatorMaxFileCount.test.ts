import { validatorMaxFileCount } from '../../validators';

describe('validatorMaxFileCount', () => {
  const maxAmount = 3;
  const validAmount = 1;
  const invalidAmount = 5;

  it('should return true if it has valid value', () => {
    expect(validatorMaxFileCount(maxAmount)(validAmount)).toBeTruthy();
  });

  it('should return true because value is incorrect', () => {
    expect(validatorMaxFileCount(maxAmount)(invalidAmount)).toEqual('common:validation.maxNumberOfDocuments');
  });
});
