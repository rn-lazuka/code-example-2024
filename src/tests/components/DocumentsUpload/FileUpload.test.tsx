import { render } from '@unit-tests';
import { FileUpload } from '@components/DocumentsUpload/components/FileUpload';
import { screen } from '@testing-library/dom';
import { waitFor } from '@testing-library/react';
import { FileTypes } from '@enums';
import { formatFileSize } from '@utils';
import userEvent from '@testing-library/user-event';
import type { FileWithId, FormFile } from '@types';
import { act } from 'react-dom/test-utils';

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      post: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          data: {
            name: 'test',
            tempKey: 'test',
          },
        });
      }),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })),
  };
});

describe('should render file component', () => {
  const onSave = jest.fn();
  const onDelete = jest.fn();
  const setFileLoadingCount = jest.fn();
  const user = userEvent.setup();

  const mockFile: FormFile = {
    type: FileTypes.IdentityDocument,
    id: '123',
    size: 123456,
    name: 'testFile.pdf',
    tempKey: '123TestFile.pdf',
  };

  it('should render file name', async () => {
    const mockFile = new File([new ArrayBuffer(1000)], 'file.jpg') as FileWithId;
    mockFile.id = '123';
    render(
      <FileUpload
        file={mockFile}
        onSave={onSave}
        onDelete={onDelete}
        setFileLoadingCount={setFileLoadingCount}
        infectedFileKeys={[]}
      />,
    );

    expect(screen.getByText('file.jpg')).toBeInTheDocument();
  });

  it('should render file size', async () => {
    render(
      <FileUpload
        file={mockFile}
        onSave={onSave}
        onDelete={onDelete}
        setFileLoadingCount={setFileLoadingCount}
        infectedFileKeys={[]}
      />,
    );
    expect(screen.getByText(formatFileSize(mockFile.size))).toBeInTheDocument();
  });

  it('should render file size error', () => {
    render(
      <FileUpload
        file={mockFile}
        maxFileSize={1024}
        onSave={onSave}
        onDelete={onDelete}
        setFileLoadingCount={setFileLoadingCount}
        infectedFileKeys={[]}
      />,
    );
    const fileSize = screen.queryByTestId('fileSize');
    const fileError = screen.queryByTestId('fileError');

    expect(fileSize).not.toBeInTheDocument();
    expect(fileError).toHaveTextContent('validation.maxFileSize');
  });

  it('should render max file count error', () => {
    render(
      <FileUpload
        file={mockFile}
        maxCountError={'maxFileCountError'}
        onSave={onSave}
        onDelete={onDelete}
        setFileLoadingCount={setFileLoadingCount}
        infectedFileKeys={[]}
      />,
    );
    expect(screen.queryByTestId('fileError')).toHaveTextContent('maxFileCountError');
  });

  it('should call delete callback', async () => {
    render(
      <FileUpload
        file={mockFile}
        onSave={onSave}
        onDelete={onDelete}
        setFileLoadingCount={setFileLoadingCount}
        infectedFileKeys={[]}
      />,
    );
    const deleteButton = screen.getByTestId('deleteButton');
    await act(() => user.click(deleteButton));
    expect(onDelete).toBeCalled();
  });

  // TODO some issues with onUpdateProgress, need to wait new version of msw
  it.skip('should call onSave with params', async () => {
    const mockFile = new File([new ArrayBuffer(1000)], 'file.jpg') as FileWithId;
    mockFile.id = '123';
    render(
      <FileUpload
        file={mockFile}
        onSave={onSave}
        onDelete={onDelete}
        setFileLoadingCount={setFileLoadingCount}
        infectedFileKeys={[]}
      />,
    );

    await waitFor(() => {
      expect(onSave).toBeCalled();
    });
    expect(onSave).toBeCalledWith(mockFile, { name: 'test', tempKey: 'test' });
  });
});
