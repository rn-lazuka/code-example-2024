import { validatorMaxFileSize } from '../../validators';

const validMockFile = {
  size: 100,
};

const invalidMockFile = {
  size: 100500,
};

const maxSize = 1000;

describe('validatorMaxFileSize', () => {
  it('should return true if it has valid value', () => {
    expect(validatorMaxFileSize(maxSize)([validMockFile])).toBeTruthy();
  });

  it('should return true if it has invalid value', () => {
    expect(validatorMaxFileSize(maxSize)([validMockFile, invalidMockFile])).toEqual('common:validation.maxFileSize');
  });
});
