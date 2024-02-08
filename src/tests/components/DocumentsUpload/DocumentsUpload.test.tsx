import { render } from '@unit-tests';
import { DocumentsUpload } from '@components/DocumentsUpload';
import { screen } from '@testing-library/dom';
import type { FormFile } from '@types';
import userEvent from '@testing-library/user-event';
import { FileTypes } from '@enums';
import { act } from 'react-dom/test-utils';

describe('should render document upload component', () => {
  const mockFile: FormFile = {
    type: FileTypes.IdentityDocument,
    id: '1',
    size: 2499,
    name: 'testFile.pdf',
    tempKey: '123TestFile.pdf',
  };
  const mockFile2: FormFile = {
    type: FileTypes.IdentityDocument,
    id: '2',
    size: 2234,
    name: 'testFile2.pdf',
    tempKey: '123TestFile2.pdf',
  };
  const onChange = jest.fn();
  const onBlur = jest.fn();
  const user = userEvent.setup();

  let props;
  beforeEach(() => {
    props = {
      label: 'label',
      onChange,
      onBlur,
      subLabel: 'subLabel',
      maxFileSize: 1024 * 5,
      error: { type: 'maxCount', message: 'maxCount error' },
      name: 'documents',
      value: [mockFile, mockFile2],
      maxFileCount: 5,
    };
  });

  it('should render label and hidden file input', () => {
    render(<DocumentsUpload {...props} />);
    const fileInput = screen.getByTestId('fileInput');

    expect(screen.getByText('label')).toBeTruthy();
    expect(screen.getByText('subLabel')).toBeTruthy();
    expect(screen.getByTestId('documentAddButton')).toBeInTheDocument();
    expect(screen.getByTestId('documentAddButton')).toHaveTextContent('button.add');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('hidden', '');
  });

  it('should render two files', () => {
    render(<DocumentsUpload {...props} />);

    expect(screen.getByText('testFile.pdf')).toBeTruthy();
    expect(screen.getByText('testFile2.pdf')).toBeTruthy();
  });

  it('should render required error message', () => {
    props.error = { type: 'required', message: 'required field' };
    props.value = [];
    render(<DocumentsUpload {...props} />);

    expect(screen.getByText('required field')).toBeTruthy();
  });

  it('should delete file from list', async () => {
    render(<DocumentsUpload {...props} />);
    const deleteButtons = screen.getAllByTestId('deleteButton');

    await act(() => user.click(deleteButtons[0]));
    expect(screen.queryByText('testFile.pdf')).not.toBeInTheDocument();
  });
});
