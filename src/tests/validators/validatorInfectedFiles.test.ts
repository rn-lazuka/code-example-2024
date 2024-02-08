import { validatorInfectedFiles } from '../../validators';

describe('validatorInfectedFiles', () => {
  const errorMessage = 'common:fileUpload.fileWasInfected';
  const infectedFileKeys = ['virus123', 'malware456'];
  const validValue = [{ tempKey: 'file1' }, { tempKey: 'file2' }, { tempKey: 'file3' }];
  const invalidValue = [{ tempKey: 'file1' }, { tempKey: 'virus123' }, { tempKey: 'file3' }];

  it('should return true if no infected files are found', () => {
    const validator = validatorInfectedFiles(infectedFileKeys);
    const result = validator(validValue);
    expect(result).toBeTruthy();
  });

  it('should return the error message if infected files are found', () => {
    const validator = validatorInfectedFiles(infectedFileKeys);
    const result = validator(invalidValue);
    expect(result).toEqual(errorMessage);
  });
});
