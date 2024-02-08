import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Control, UseFormRegister } from 'react-hook-form/dist/types/form';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { EnterLabResultsCard } from '@components/modals/ServiceModal/components/EnterLabResultsModal/components/EnterLabResultsCard';
import { EnterLabResultsInfoBlock } from '@components/modals/ServiceModal/components/EnterLabResultsModal/components/EnterLabResultsInfoBlock';
import { FormDatePicker, FormDocumentsUpload, FormInputCheckbox, FormInputText } from '@components/FormComponents';
import {
  validatorMaxLength,
  validatorMinLength,
  validatorIsValidDate,
  validatorRequired,
  validatorMaxFileCount,
  validatorMaxFileSize,
  validatorLatinLettersNumbersAllSpecialCharacters,
  validatorFutureDate,
  validatorInfectedFiles,
  validatorLatinLettersNumbersAllSpecialCharactersAndSpaces,
} from '@validators';
import { selectLabOrdersS3AntivirusErrors, selectServiceModal } from '@store/slices';
import { ServiceModalName } from '@enums';
import { EnterLabResultsInfoData, LabResultFieldsResponse, ManualEnterLabResultForm } from '@types';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_TEXT } from '@constants';
import { getTenantEndCurrentDay } from '@utils/getTenantDate';

type EnterLabResultsFormViewProps = {
  control: Control<ManualEnterLabResultForm>;
  register: UseFormRegister<ManualEnterLabResultForm>;
  setFileLoadingCount: Dispatch<SetStateAction<number>>;
  dynamicTextFields: any[];
  dynamicCheckboxFields: any[];
  dynamicFieldsData: LabResultFieldsResponse[];
  isFileLink: boolean;
};

export const EnterLabResultsFormView = ({
  control,
  register,
  setFileLoadingCount,
  dynamicTextFields,
  dynamicCheckboxFields,
  dynamicFieldsData,
  isFileLink,
}: EnterLabResultsFormViewProps) => {
  const { t } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const data = selectServiceModal(ServiceModalName.EnterLabResultModal);
  const infectedFileKeys = selectLabOrdersS3AntivirusErrors();

  const {
    labOrder: { procedureName, number, createdAt, labName, patient, document, id },
  } = data;

  const labOrderInfoData: EnterLabResultsInfoData[] = [
    {
      name: t('modals.procedure'),
      value: procedureName,
    },
    {
      name: t('modals.labOrderNumber'),
      value: number.toString(),
    },
    {
      name: t('modals.labOrderDate'),
      value: format(new Date(createdAt), 'dd/MM/yyyy'),
    },
    {
      name: t('modals.labName'),
      value: labName,
    },
  ];
  const patientInfoData: EnterLabResultsInfoData[] = [
    {
      name: t('modals.patientName'),
      value: patient.name,
    },
    {
      name: t('modals.NRIC/Passport'),
      value: document.number,
    },
    {
      name: t('modals.dateOfBirth'),
      value: patient.dateBirth ? format(new Date(patient.dateBirth), 'dd/MM/yyyy') : '-',
    },
  ];

  const setDynamicFieldLabel = (fieldName: string, group: LabResultFieldsResponse): string => {
    return group.ranges.find((item) => item.code === fieldName)?.name || '';
  };

  const setDynamicFieldRangeLabel = (fieldName: string, group: LabResultFieldsResponse): string => {
    const fieldData = group.ranges.find((item) => item.code === fieldName);
    return `${fieldData?.range || ''} ${fieldData?.measurement || ''}`;
  };

  const getFieldIndex = (fieldName: string, fieldType: 'text' | 'checkbox'): number => {
    if (fieldType === 'text') {
      return dynamicTextFields.indexOf(dynamicTextFields.find((field) => field.name === fieldName)!);
    }
    return dynamicCheckboxFields.indexOf(dynamicCheckboxFields.find((field) => field.name === fieldName)!);
  };

  return (
    <Stack spacing={2} data-testid="LabResultFormView">
      <EnterLabResultsCard>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" flexWrap="nowrap" spacing={2}>
            <EnterLabResultsInfoBlock items={labOrderInfoData} />
            <EnterLabResultsInfoBlock items={patientInfoData} />
          </Stack>
          <Stack direction="row" justifyContent="space-between" flexWrap="nowrap" spacing={2}>
            <FormDatePicker
              fullWidth
              required
              control={control}
              maxDate={getTenantEndCurrentDay()}
              name="resultDate"
              label={t('forms.manualResultEnter.resultDate')}
              rules={{
                required: validatorRequired(),
                validate: {
                  isValid: validatorIsValidDate,
                  isFuture: validatorFutureDate(tCommon('validation.enteredDateShouldNotBeLater')),
                },
              }}
            />
            <FormInputText
              control={control}
              name="labResultNumber"
              label={t('forms.manualResultEnter.labResultNumber')}
              rules={{
                pattern: validatorLatinLettersNumbersAllSpecialCharacters(),
                minLength: validatorMinLength(1, 50),
                maxLength: validatorMaxLength(1, 50),
              }}
            />
          </Stack>
          <Box>
            <FormDocumentsUpload
              name="file"
              control={control}
              maxFileSize={MAX_FILE_SIZE}
              multiple={false}
              label={t('forms.manualResultEnter.uploadFile')}
              subLabel={tCommon('fileUpload.fileLimits', { maxFileCount: 1, maxFileSize: MAX_FILE_SIZE_TEXT })}
              maxFileCount={1}
              rules={{
                validate: {
                  maxCount: validatorMaxFileCount(1),
                  maxSize: validatorMaxFileSize(MAX_FILE_SIZE),
                  infected: validatorInfectedFiles(infectedFileKeys),
                },
              }}
              setFileLoadingCount={setFileLoadingCount}
              linkUrl={isFileLink ? `/pm/lab-results/${id}/printing` : undefined}
              infectedFileKeys={infectedFileKeys}
            />
          </Box>
        </Stack>
      </EnterLabResultsCard>
      {!dynamicFieldsData.length ? (
        <EnterLabResultsCard>
          <Skeleton height={30} data-testid="dynamicFieldsSkeleton" />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
        </EnterLabResultsCard>
      ) : (
        dynamicFieldsData.map((group) => {
          const { categoryCode } = group;
          const groupCodes = group.ranges.map((item) => item.code);
          const filteredTextFields = dynamicTextFields.filter((field) => groupCodes.includes(field.name));
          return (
            <Stack key={categoryCode} spacing={2} data-testid="dynamicFields">
              <EnterLabResultsCard>
                <Typography variant="headerM" mb={3}>
                  {t(`forms.manualResultEnter.labResultTestCategories.${categoryCode}`)}
                </Typography>
                <Stack spacing={1}>
                  {filteredTextFields.map((field) => {
                    return (
                      <Stack
                        key={field.id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        data-testid="filteredTextFields"
                      >
                        <Stack direction="row" spacing={2} alignItems="center" flexBasis={1}>
                          <Typography textAlign="right" variant="labelM" sx={({ spacing }) => ({ width: spacing(15) })}>
                            {setDynamicFieldLabel(field.name, group)}
                          </Typography>
                          <FormInputText
                            {...register(`tests.${getFieldIndex(field.name, 'text')}.value`)}
                            hiddenLabel
                            control={control}
                            inputProps={{ inputMode: 'numeric' }}
                            rules={{
                              pattern: validatorLatinLettersNumbersAllSpecialCharactersAndSpaces(),
                              minLength: validatorMinLength(1, 50),
                              maxLength: validatorMaxLength(1, 50),
                            }}
                            sx={({ spacing }) => ({
                              width: spacing(15),
                              '& .MuiInputBase-input': {
                                py: 1.2,
                                fontWeight: 500,
                                fontSize: 14,
                              },
                            })}
                          />
                          <Typography variant="paragraphM" sx={({ spacing }) => ({ width: spacing(15) })}>
                            {setDynamicFieldRangeLabel(field.name, group)}
                          </Typography>
                        </Stack>
                        <FormInputCheckbox
                          {...register(`checkboxes.${getFieldIndex(field.name, 'checkbox')}.value`)}
                          control={control}
                          label={t('forms.manualResultEnter.abnormal')}
                          sx={{ justifySelf: 'flex-end' }}
                        />
                      </Stack>
                    );
                  })}
                </Stack>
              </EnterLabResultsCard>
            </Stack>
          );
        })
      )}
    </Stack>
  );
};
