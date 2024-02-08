import { API, handleFileLinkClick } from '@utils';

describe('handleFileLinkClick', () => {
  const url = 'https://example.com/file.pdf';
  const file = {
    id: 123,
    name: 'example.pdf',
  };
  const blob = new Blob(['file contents'], { type: 'application/pdf' });
  API.get = jest.fn().mockResolvedValue({ data: blob });

  afterEach(() => {
    jest.clearAllMocks();
    document.querySelectorAll('a').forEach((link) => link.remove());
  });

  it('should create a link element with the expected attributes and click it', async () => {
    await handleFileLinkClick(url, file);
    expect(API.get).toHaveBeenCalledWith(url, { responseType: 'blob' });

    const link = document.querySelector(`[data-testid="file-${file.id}"]`) as unknown as any;
    expect(link).not.toBeNull();
    expect(link!.target).toBe('_blank');

    expect(link?.dispatchEvent(new MouseEvent('click'))).toBe(true);
  });

  it('should add a "download" attribute to the link element for non-PDF files', async () => {
    const nonPdfFile = { id: 456, name: 'example.docx' };
    const nonPdfBlob = new Blob(['file contents'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    API.get = jest.fn().mockResolvedValue({ data: nonPdfBlob });

    await handleFileLinkClick(url, nonPdfFile);

    const link = document.querySelector(`[data-testid="file-${nonPdfFile.id}"]`) as unknown as any;
    expect(link?.download).toBe(nonPdfFile.name);
  });

  it('should remove the link element from the DOM if "removeLink" is true', async () => {
    const parent = document.createElement('div');
    document.body.appendChild(parent);

    await handleFileLinkClick(url, file, true);

    const link = document.querySelector(`[data-testid="file-${file.id}"]`);
    expect(link).toBeNull();
    expect(parent.querySelector(`[data-testid="file-${file.id}"]`)).toBeNull();
  });
});
