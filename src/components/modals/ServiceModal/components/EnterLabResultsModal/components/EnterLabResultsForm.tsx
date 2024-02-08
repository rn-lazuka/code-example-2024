import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { EnterLabResultsFormView } from '@components/modals/ServiceModal/components/EnterLabResultsModal/components/EnterLabResultsFormView';
import {
  addServiceModal,
  removeServiceModal,
  selectLabOrdersIsSubmitting,
  selectServiceModal,
  submitManualLabResults,
} from '@store/slices';
import { FileTypes, ServiceModalName } from '@enums';
import {
  LabResultFieldsResponse,
  ManualEnterLabResultFileType,
  ManualEnterLabResultForm,
  ManualEnterLabResultTestSetItem,
  FileDocument,
} from '@types';
import { useAppDispatch } from '@hooks/storeHooks';
import { Event } from '@services/Event/Event';

type EnterLabResultsFormProps = {
  dynamicFieldsData: LabResultFieldsResponse[];
  testSets: ManualEnterLabResultTestSetItem[];
  labResultFile: ManualEnterLabResultFileType[];
  onCancel: () => void;
};

export const EnterLabResultsForm = ({
  dynamicFieldsData,
  testSets,
  labResultFile,
  onCancel,
}: EnterLabResultsFormProps) => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const {
    labOrder: { createdAt, id, number },
    isEditing,
  } = selectServiceModal(ServiceModalName.EnterLabResultModal);
  const isSubmitting = selectLabOrdersIsSubmitting();
  const [fileLoadingCount, setFileLoadingCount] = useState(0);
  const [isFileLink, setIsFileLink] = useState(false);

  const defaultValues = {
    resultDate: new Date(createdAt),
    labResultNumber: number,
    tests: [],
    checkboxes: [],
    file: labResultFile,
  };

  const { watch, control, register, handleSubmit } = useForm<ManualEnterLabResultForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });
  const fileField = watch('file');

  const openCancellationModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => {
            dispatch(removeServiceModal(ServiceModalName.EnterLabResultModal));
          },
          title: t('closeWithoutSaving'),
          text: t('dataLost'),
          confirmButton: t('button.continue'),
        },
      }),
    );
  };

  useEffect(() => {
    const onCloseEnterLabResultsModal = () =>
      isDirty ? openCancellationModal() : dispatch(removeServiceModal(ServiceModalName.EnterLabResultModal));
    Event.subscribe('closeEnterLabResultsModal', onCloseEnterLabResultsModal);
    return () => Event.unsubscribe('closeEnterLabResultsModal', onCloseEnterLabResultsModal);
  }, [isDirty]);

  const { fields: dynamicTextFields, append: appendDynamicTextField } = useFieldArray<ManualEnterLabResultForm>({
    control,
    name: 'tests',
  });
  const { fields: dynamicCheckboxFields, append: appendDynamicCheckboxField } = useFieldArray<ManualEnterLabResultForm>(
    {
      control,
      name: 'checkboxes',
    },
  );

  const onSubmit = (data: ManualEnterLabResultForm) => {
    const categories = Array.from(new Set(data.tests.map((test) => test.category)));
    const testSets = categories.map((category) => {
      return {
        categoryCode: category,
        tests: data.tests
          .filter((test) => test.category === category)
          .map((filteredTest) => ({
            code: filteredTest.name,
            value: filteredTest.value,
            isAbnormal: data.checkboxes.find((checkbox) => filteredTest.name === checkbox.name)!.value,
          })),
      };
    });
    dispatch(
      submitManualLabResults({
        isEditing,
        labOrderId: id,
        submitData: {
          labResultNumber: data.labResultNumber,
          resultDate: data.resultDate,
          testSets,
          file: data?.file?.length
            ? data.file.map((file) => {
                if (file.tempKey) {
                  return {
                    name: file.name,
                    type: FileTypes.LabOrderResult,
                    tempKey: file.tempKey,
                    size: file.size,
                  } as FileDocument;
                }
                return file;
              })[0]
            : null,
        },
      }),
    );
  };

  useEffect(() => {
    const isTestsSet = !!testSets.length;
    if (dynamicFieldsData.length) {
      dynamicFieldsData.forEach(({ ranges, categoryCode }) => {
        ranges.forEach(({ code }) => {
          appendDynamicTextField({
            name: code,
            value: isTestsSet ? testSets.find((test) => test.name === code)?.value || '' : '',
            category: categoryCode,
          });
          appendDynamicCheckboxField({
            name: code,
            value: isTestsSet ? testSets.find((test) => test.name === code)?.isAbnormal || false : false,
            category: categoryCode,
          });
        });
      });
    }
  }, [dynamicFieldsData, testSets]);

  useEffect(() => {
    setIsFileLink(!!fileField && labResultFile[0]?.id === fileField[0]?.id);
  }, [labResultFile, fileField]);

  return (
    <>
      <EnterLabResultsFormView
        control={control}
        register={register}
        setFileLoadingCount={setFileLoadingCount}
        dynamicTextFields={dynamicTextFields}
        dynamicCheckboxFields={dynamicCheckboxFields}
        dynamicFieldsData={dynamicFieldsData}
        isFileLink={isFileLink}
      />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={({ palette, spacing }) => ({
          p: spacing(2, 2, 0, 2),
          borderTop: `solid 1px ${palette.border.default}`,
        })}
      >
        <Button
          disabled={isSubmitting}
          onClick={onCancel}
          variant="outlined"
          data-testid="cancelPatientStatusFormButton"
        >
          {t('button.cancel')}
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant={'contained'}
          disabled={isSubmitting || fileLoadingCount > 0}
          data-testid="submitPatientStatusFormButton"
        >
          {t(`button.save`)}
          {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
        </Button>
      </Stack>
    </>
  );
};
