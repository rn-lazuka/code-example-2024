import { render } from '@unit-tests';
import type { FileDocument } from '@types';
import { FileTypes } from '@enums';
import { FileLink } from '@components';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { API } from '@utils';
import { act } from 'react-dom/test-utils';

const file: FileDocument = {
  id: 1,
  name: 'test_file_name.pdf',
  type: FileTypes.HdPrescription,
  size: 5458,
  tempKey: '',
  createAt: '',
  error: {
    code: 'RESOURCE_NOT_FOUND',
    description: 'User not found',
    id: '2022-09-23T08:39:57.811Z',
  },
};

const patientId = '456';

describe('FileLink', () => {
  const user = userEvent.setup();

  beforeAll(() => {
    const blob = new Blob(['test'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    global.window.URL.createObjectURL = jest.fn().mockReturnValue(url);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('downloads file on click', async () => {
    const blob = new Blob(['test'], { type: 'application/pdf' });
    API.get = jest.fn().mockResolvedValue({ data: blob });

    render(<FileLink file={file} patientId={patientId} />);

    const link = screen.getByText(file.name);
    expect(link).toBeInTheDocument();
    await act(() => user.click(link));
    expect(API.get).toHaveBeenCalledWith(`/pm/patients/${patientId}/files/${file.id}`, {
      responseType: 'blob',
    });
  });

  it('downloads PDF file with download attribute', async () => {
    const blob = new Blob(['test'], { type: 'image/jpeg' });
    API.get = jest.fn().mockResolvedValue({ data: blob });

    render(<FileLink file={file} patientId={patientId} removeLink={false} />);
    const link = screen.getByTestId('fileLinkForDownload');
    await act(() => user.click(link));

    const linkWithTestId = screen.getByTestId(`file-${file.id}`);
    expect(linkWithTestId).toHaveAttribute('href', expect.any(String));
    expect(linkWithTestId).toHaveAttribute('target', '_blank');
    expect(linkWithTestId).toHaveAttribute('download', file.name);
    expect(linkWithTestId).toBeInTheDocument();
  });

  it('should check that link is removed', async () => {
    const blob = new Blob(['test'], { type: 'image/jpeg' });
    API.get = jest.fn().mockResolvedValue({ data: blob });

    render(<FileLink file={file} patientId={patientId} />);
    const link = screen.getByTestId('fileLinkForDownload');
    await act(() => user.click(link));

    expect(screen.queryByTestId(`file-${file.id}`)).not.toBeInTheDocument();
  });
});
