import { getFileParamsFromHeaders } from '@utils/getFileParamsFromHeaders';

describe('getFileParamsFromHeaders', () => {
  const headers = {
    'content-disposition': 'attachment; filename="test.txt"',
    'content-type': 'text/plain',
  };

  it('should extract file name and file type from headers', () => {
    const result = getFileParamsFromHeaders(headers);
    expect(result.fileName).toBe('test.txt');
    expect(result.fileType).toBe('text/plain');
  });

  it('should handle missing file name in content disposition header', () => {
    const headersWithoutFileName = {
      'content-disposition': 'attachment',
      'content-type': 'text/plain',
    };
    const result = getFileParamsFromHeaders(headersWithoutFileName);
    expect(result.fileName).toBe('');
    expect(result.fileType).toBe('text/plain');
  });

  it('should handle missing content type header', () => {
    const headersWithoutContentType = {
      'content-disposition': 'attachment; filename="test.txt"',
    };
    const result = getFileParamsFromHeaders(headersWithoutContentType);
    expect(result.fileName).toBe('test.txt');
    expect(result.fileType).toBeUndefined();
  });
});
