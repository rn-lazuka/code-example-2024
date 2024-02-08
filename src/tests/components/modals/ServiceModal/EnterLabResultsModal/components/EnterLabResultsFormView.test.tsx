import { LabResultFieldsResponse, ManualEnterLabResultForm } from '@types';
import { screen } from '@testing-library/react';
import { render } from '@unit-tests';
import { useForm } from 'react-hook-form';
import { FileTypes, LabResultTestCategories } from '@enums/global';
import { ServiceModalName } from '@enums';
import { EnterLabResultsFormView } from '@src/components/modals/ServiceModal/components/EnterLabResultsModal/components/EnterLabResultsFormView';

const modalPayloadMock = {
  labOrder: {
    id: '1',
    procedureName: 'test',
    number: 1,
    createdAt: '2022-10-15T12:34:56Z',
    labName: 'test',
    patient: { id: '1', name: 'test', dateBirth: '2022-10-15T12:34:56Z' },
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
      createAt: '2022-10-15T12:34:56Z',
      type: FileTypes.HdPrescription,
      size: 1024,
      tempKey: 'test',
      error: { id: '1', code: 'some code', description: 'test' },
    },
  ],
  tests: [],
  labResultNumber: 1,
  resultDate: new Date('2022-10-15T12:34:56Z'),
};

describe('EnterLabResultsFormView', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let form;
  const setFileLoadingCountMock = jest.fn();
  const dynamicFieldsDataMock = [
    {
      categoryCode: LabResultTestCategories.Biochemistry,
      ranges: [{ name: 'test', range: 'test', code: 'test', measurement: 'test', order: 1 }],
    },
  ];
  const dynamicTextFieldsDataMock = [{ name: 'test' }];

  beforeEach(() => {
    form = null;
  });

  const TestComponent = ({
    dynamicCheckboxFields = [],
    dynamicTextFields = [],
    dynamicFieldsData = [],
    isFileLink = false,
  }: {
    dynamicCheckboxFields?: any[];
    dynamicFieldsData?: LabResultFieldsResponse[];
    dynamicTextFields?: any[];
    isFileLink?: boolean;
  }) => {
    form = useForm<ManualEnterLabResultForm>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues,
      shouldUnregister: true,
    });

    return (
      <EnterLabResultsFormView
        control={form.control}
        register={form.register}
        dynamicCheckboxFields={dynamicCheckboxFields}
        dynamicFieldsData={dynamicFieldsData}
        dynamicTextFields={dynamicTextFields}
        isFileLink={isFileLink}
        setFileLoadingCount={setFileLoadingCountMock}
      />
    );
  };

  it('should render the form with skeleton if no dynamic fields', () => {
    render(<TestComponent />, {
      preloadedState: { serviceModal: { [ServiceModalName.EnterLabResultModal]: modalPayloadMock } },
    });
    expect(screen.getByTestId('LabResultFormView')).toBeInTheDocument();
    expect(screen.getByTestId('resultDateDatePicker')).toBeInTheDocument();
    expect(screen.getByTestId('labResultNumberTextInput')).toBeInTheDocument();
    expect(screen.getByTestId('file_FIELD')).toBeInTheDocument();
    expect(screen.getByTestId('dynamicFieldsSkeleton')).toBeInTheDocument();
  });
  it('should render the form with dynamic fields if data passed', () => {
    render(<TestComponent dynamicFieldsData={dynamicFieldsDataMock} />, {
      preloadedState: { serviceModal: { [ServiceModalName.EnterLabResultModal]: modalPayloadMock } },
    });
    expect(screen.getByTestId('dynamicFields')).toBeInTheDocument();
  });
  it('should render the form with filtered text fields if dynamicTextFields data passed', () => {
    render(<TestComponent dynamicTextFields={dynamicTextFieldsDataMock} dynamicFieldsData={dynamicFieldsDataMock} />, {
      preloadedState: { serviceModal: { [ServiceModalName.EnterLabResultModal]: modalPayloadMock } },
    });
    expect(screen.getByTestId('filteredTextFields')).toBeInTheDocument();
  });
});
