import userEvent from '@testing-library/user-event';
import { render } from '@unit-tests';
import { UploadPhotoModal, UploadPhotoModalStep } from '@components/pages/PatientProfile';
import { screen, waitFor } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';

describe('Upload photo modal', () => {
  const onClose = jest.fn();
  const setNewImage = jest.fn();
  const user = userEvent.setup();
  const file = new File(['hello'], 'hello.png', { type: 'image/png' });
  window.URL.createObjectURL = jest.fn();

  it('should render modal with add photo step if isOpen prop is true', () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.AddPhoto}
      />,
    );
    expect(screen.getByTestId('uploadPhotoButton')).toBeInTheDocument();
    expect(screen.getByText('profile.profilePhoto')).toBeInTheDocument();
  });

  it('should open processing step after file upload', async () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.AddPhoto}
      />,
    );
    await act(() => user.upload(screen.getByTestId('UploadPhotoInput'), file));
    expect(window.URL.createObjectURL).toBeCalledTimes(1);
    expect(screen.getByText('profile.croppingAndRotating')).toBeTruthy();
  });

  it('should open add photo step after click back button on processing page', async () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.AddPhoto}
      />,
    );
    await act(() => user.upload(screen.getByTestId('UploadPhotoInput'), file));
    await act(() => user.click(screen.getByTestId('backArrowButton')));
    expect(screen.getByTestId('uploadPhotoButton')).toBeInTheDocument();
  });

  it('should close modal after click on close icon', async () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.AddPhoto}
      />,
    );
    await act(() => user.click(screen.getByTestId('closeButton')));
    expect(onClose).toBeCalledTimes(1);
  });

  it('should render modal with change photo step if isOpen prop is true', () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.ChangePhoto}
      />,
    );
    expect(screen.getByTestId('changePhotoButton')).toBeTruthy();
    expect(screen.getByTestId('deletePhotoButton')).toBeTruthy();
  });

  it('should render modal with delete photo step after click on Delete button', async () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.ChangePhoto}
      />,
    );
    await act(() => user.click(screen.getByTestId('deletePhotoButton')));
    expect(screen.getByTestId('confirmDeletePhotoButton')).toBeTruthy();
  });

  it('should delete photo and close modal', async () => {
    const onClose = jest.fn();
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.ChangePhoto}
      />,
    );
    await act(() => user.click(screen.getByTestId('deletePhotoButton')));
    await act(() => user.click(screen.getByTestId('confirmDeletePhotoButton')));
    expect(onClose).toBeCalledTimes(1);
  });

  it('should disable save button while submitting', async () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.ProcessingPhoto}
      />,
    );
    await act(() => user.click(screen.getByTestId('savePhotoButton')));
    expect(screen.getByTestId('savePhotoButton')).toHaveAttribute('disabled');
    expect(screen.getByTestId('progressbar')).toBeInTheDocument();
  });

  it('should render modal with change photo step after click on back button', async () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.DeletePhoto}
      />,
    );
    await act(() => user.click(screen.getByTestId('backArrowButton')));
    expect(screen.getByTestId('changePhotoButton')).toBeInTheDocument();
    expect(screen.getByTestId('deletePhotoButton')).toBeInTheDocument();
  });

  it('should render modal with change photo step after click on cancel button', async () => {
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.DeletePhoto}
      />,
    );
    await act(() => user.click(screen.getByTestId('cancelDeletePhotoButton')));
    expect(screen.getByTestId('changePhotoButton')).toBeTruthy();
    expect(screen.getByTestId('deletePhotoButton')).toBeTruthy();
  });

  it('should render camera container if camera permission is valid', async () => {
    mockMediaDevices();
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.AddPhoto}
      />,
    );
    await waitFor(() => {
      expect(window.navigator.mediaDevices.getUserMedia).toBeCalledWith({
        video: { facingMode: 'environment', height: 300, width: 400 },
        audio: false,
      });
    });
    expect(screen.findByTestId('openCameraContainer')).toBeTruthy();
  });

  it('should render avatar container if camera permission is denied', async () => {
    mockMediaDevices();
    render(
      <UploadPhotoModal
        setCurrentPhoto={setNewImage}
        onClose={onClose}
        isOpen={true}
        step={UploadPhotoModalStep.AddPhoto}
      />,
    );
    await waitFor(() => {
      expect(window.navigator.mediaDevices.getUserMedia).toBeCalledWith({
        video: { facingMode: 'environment', width: 400, height: 300 },
        audio: false,
      });
    });
    expect(screen.findByTestId('openAvatarContainer')).toBeTruthy();
  });
});

const mockMediaDevices = () => {
  const mockGetUserMedia = jest.fn(async () => {
    return Promise.resolve();
  });
  Object.defineProperty(window.navigator, 'mediaDevices', {
    writable: true,
    value: { getUserMedia: mockGetUserMedia },
  });
};
