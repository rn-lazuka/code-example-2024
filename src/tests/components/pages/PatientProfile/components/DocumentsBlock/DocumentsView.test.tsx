import type { FileDocument } from '@types';
import { DocumentsView } from '@components/pages/PatientProfile';
import { screen } from '@testing-library/dom';
import { FileTypes } from '@enums';
import { render } from '@unit-tests';

const documents: FileDocument[] = [
  {
    id: 1,
    name: 'my_photo1.jpg',
    type: FileTypes.IdentityDocument,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
  {
    id: 2,
    name: 'my_photo2.jpg',
    type: FileTypes.IdentityDocument,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
  {
    id: 3,
    name: 'my_photo3.jpg',
    type: FileTypes.BloodTest,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
  {
    id: 4,
    name: 'my_photo4.jpg',
    type: FileTypes.Consultation,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
  {
    id: 5,
    name: 'my_photo5.jpg',
    type: FileTypes.HdPrescription,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
  {
    id: 6,
    name: 'my_photo6.jpg',
    type: FileTypes.MedicalReport,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
  {
    id: 7,
    name: 'my_photo7.jpg',
    type: FileTypes.MedicalReport,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
  {
    id: 8,
    name: 'my_photo8.jpg',
    type: FileTypes.MedicalReport,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
  {
    id: 9,
    name: 'my_photo10.jpg',
    type: FileTypes.Other,
    size: 1231232,
    createAt: '2022-09-23T08:39:57.811Z',
    tempKey: '123123343.pdf',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      description: 'User not found',
      id: '2022-09-23T08:39:57.811Z',
    },
  },
];

const patient = {
  id: 'exampleId',
  name: 'Chuck Norris',
};

describe('View of the patient documents', () => {
  it('should show files for download or empty state', async () => {
    render(<DocumentsView documents={documents} />, {
      preloadedState: { patient: { patient, loading: false, saveSuccess: false } },
    });
    const fileList = screen.getAllByTestId('fileLinkForDownload');
    const emptyField = screen.getAllByText('—');
    expect(fileList.length).toBe(9);
    expect(emptyField.length).toBe(1);
  });
});
