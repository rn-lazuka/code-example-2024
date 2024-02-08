import {
  LabResultFieldsResponse,
  ManualEnterLabResultFileType,
  ManualEnterLabResultForm,
  ManualEnterLabResultTestSetItem,
} from '@types';
import { screen } from '@testing-library/react';
import { render } from '@unit-tests';
import { useForm } from 'react-hook-form';
import { FileTypes } from '@enums/global';
import { EnterLabResultsForm } from '@components/modals/ServiceModal/components/EnterLabResultsModal/components/EnterLabResultsForm';
import { ServiceModalName } from '@enums';

const modalPayloadMock = {
  labOrder: {
    id: '1',
    procedureName: 'test',
    number: 1,
    createdAt: '01-01-2023',
    labName: 'test',
    patient: { id: '1', name: 'test' },
    document: { code: 'test', number: '123145' },
  },
  isEditing: false,
};
const defaultValues: ManualEnterLabResultForm = {
  checkboxes: [],
  file: [
    {
      name: 'test',
      id: 1,
      createAt: '01-01-2023',
      type: FileTypes.HdPrescription,
      size: 1024,
      tempKey: 'test',
      error: { id: '1', code: 'some code', description: 'test' },
    },
  ],
  tests: [],
  labResultNumber: 1,
  resultDate: '01-01-2023',
};

describe('EnterLabResultsForm', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let form;
  let onCancelCallback;

  beforeEach(() => {
    form = null;
    onCancelCallback = jest.fn();
  });

  const TestComponent = ({
    dynamicFieldsData = [],
    labResultFile = [],
    testSets = [],
  }: {
    dynamicFieldsData?: LabResultFieldsResponse[];
    labResultFile?: ManualEnterLabResultFileType[];
    testSets?: ManualEnterLabResultTestSetItem[];
  }) => {
    form = useForm<ManualEnterLabResultForm>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues,
      shouldUnregister: true,
    });

    return (
      <EnterLabResultsForm
        dynamicFieldsData={dynamicFieldsData}
        labResultFile={labResultFile}
        testSets={testSets}
        onCancel={onCancelCallback}
      />
    );
  };

  it("should render the form and check that it's being rendered in the default state", () => {
    render(<TestComponent />, {
      preloadedState: { serviceModal: { [ServiceModalName.EnterLabResultModal]: modalPayloadMock } },
    });
    expect(screen.getByTestId('cancelPatientStatusFormButton')).toBeInTheDocument();
    expect(screen.getByTestId('submitPatientStatusFormButton')).toBeInTheDocument();
  });
});
