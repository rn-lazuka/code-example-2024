import { formatFileSize } from '@utils';

describe('should format file size', () => {
  it('should format to Mb', () => {
    expect(formatFileSize(1024 * 1024 * 2)).toBe('2.0 MB');
  });

  it('should format to Kb', () => {
    expect(formatFileSize(1200)).toBe('1.2 KB');
  });

  it('should format to B', () => {
    expect(formatFileSize(400)).toBe('400 B');
  });
});
