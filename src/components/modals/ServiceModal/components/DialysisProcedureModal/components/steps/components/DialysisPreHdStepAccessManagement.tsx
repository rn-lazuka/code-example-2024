import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useMemo } from 'react';
import { Control } from 'react-hook-form/dist/types/form';
import type { PreHDForm, CvcAccessManagementResponse, VascularAccessManagementResponse } from '@types';
import { InfoCard } from '@components/InfoCard/InfoCard';
import { FormInputCheckbox, FormInputRadio, FormInputText, StyledPatientRowStack } from '@components';
import { validatorMaxLength, validatorMinLength, validatorRequired } from '@validators';
import { latinLettersNumbersCharactersReg } from '@src/regexp';
import { useTranslation } from 'react-i18next';
import { additionalCVCFields, cvcFields, vascularFields } from '@constants';
import { AccessCategory, Instillation } from '@enums';
import Typography from '@mui/material/Typography';
import { dateFormat, Dictionaries, getCodeValueFromCatalog, getOptionListFromCatalog } from '@utils';
import Stack from '@mui/material/Stack';
import { NeedleSizeRadioLabel } from '@components/pages/PatientProfile';
import { selectIsDisableInterface } from '@store/slices/dialysisSlice';
import { UseFormWatch } from 'react-hook-form';

type DialysisPreHdStepAccessManagementProps = {
  control: Control<PreHDForm>;
  accessManagement: VascularAccessManagementResponse | CvcAccessManagementResponse;
  isMulti: boolean;
  index: number;
  watch: UseFormWatch<PreHDForm>;
};

const customRadioLabelRender = (label) => <NeedleSizeRadioLabel label={label} />;

const DialysisPreHdStepAccessManagement = ({
  control,
  accessManagement,
  isMulti,
  index,
  watch,
}: DialysisPreHdStepAccessManagementProps) => {
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const isDisabledInterface = selectIsDisableInterface();

  const instillationValue = watch(`access.${index}.instillation`);
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const getTitle = () => {
    if (isMulti) {
      if (accessManagement.accessCategory === AccessCategory.VascularAccess) {
        return t('form.accessManagementVascular');
      } else {
        return t('form.accessManagementCVC');
      }
    }
    return t('form.accessManagement');
  };
  const currentFields = accessManagement.accessCategory === AccessCategory.CVC ? cvcFields : vascularFields;

  const categoryFieldValue = () => {
    let category;
    if ('category' in accessManagement) {
      category = getCodeValueFromCatalog('cvcCategories', accessManagement.category!);
    }
    if ('type' in accessManagement) {
      category = getCodeValueFromCatalog('accessTypes', accessManagement.type!);
    }
    return `${getCodeValueFromCatalog(
      'accessCategories',
      accessManagement?.accessCategory!,
    )}, ${category}, ${getCodeValueFromCatalog('sides', accessManagement.side!)}`;
  };

  const showFieldValue = (field: string) => {
    switch (field) {
      case 'insertionDate':
      case 'creationDate':
        return (
          <Typography variant="labelM">
            {accessManagement?.[field] ? dateFormat(accessManagement[field] as string) : '—'}
          </Typography>
        );
      case 'accessCategory':
        return <Typography variant="labelM">{categoryFieldValue()}</Typography>;
      default:
        return (
          <Typography variant="labelM" sx={{ flex: 1, whiteSpace: 'pre-wrap' }}>
            {accessManagement?.[field] ? accessManagement?.[field] : '—'}
          </Typography>
        );
    }
  };

  const needleOptions = useMemo(() => getOptionListFromCatalog(Dictionaries.NeedleSizes).reverse(), []);

  return (
    <InfoCard title={getTitle()} isXs={isXs} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
      {isMulti && (
        <FormInputCheckbox
          control={control}
          name={`access.${index}.wasUsed`}
          label={t('form.wasUsed')}
          sx={{ mb: 2 }}
          isDisabled={isDisabledInterface}
        />
      )}
      <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
        {currentFields.map((field) => (
          <StyledPatientRowStack
            direction="row"
            spacing={2}
            key={field}
            width={isXs ? 17.4375 : 26.375}
            textAlign="start"
          >
            <Typography variant="labelM">{t(`form.${field}`)}</Typography>
            {showFieldValue(field)}
          </StyledPatientRowStack>
        ))}
      </Stack>
      {/* CvcAccessManagement */}
      {'category' in accessManagement && (
        <>
          <Typography variant="headerS" sx={{ pt: 2, mb: 1 }}>
            {t('form.instillation')}
          </Typography>
          <FormInputRadio
            control={control}
            name={`access.${index}.instillation`}
            options={getOptionListFromCatalog(Dictionaries.Instillation)}
            isDisabled={isDisabledInterface}
            sx={[accessManagement.instillation?.code === Instillation.Others && { mb: 1 }]}
          />
          {instillationValue === Instillation.Others && (
            <FormInputText
              control={control}
              name={`access.${index}.instillationExtValue`}
              label={t('form.others')}
              required
              isDisabled={isDisabledInterface}
              rules={{
                required: validatorRequired(),
                minLength: validatorMinLength(2, 50),
                maxLength: validatorMaxLength(2, 50),
                pattern: {
                  value: latinLettersNumbersCharactersReg,
                  message: tCommon('validation.latinLettersAndSymbols'),
                },
              }}
              sx={{ mb: 2 }}
            />
          )}
          <Stack direction="column" spacing={1}>
            {additionalCVCFields.map((field) => (
              <StyledPatientRowStack direction="row" spacing={2} key={field} width={26.375} textAlign="start">
                <Typography variant="labelM">{t(`form.${field}`)}</Typography>
                {showFieldValue(field)}
              </StyledPatientRowStack>
            ))}
          </Stack>
        </>
      )}
      {/* VascularAccessManagement */}
      {'type' in accessManagement && (
        <Stack direction="column" spacing={2} sx={{ my: 2 }}>
          <FormInputRadio
            control={control}
            name={`access.${index}.needleType`}
            label={<Typography variant="headerS">{t('form.needleType')}</Typography>}
            isDisabled={isDisabledInterface}
            options={getOptionListFromCatalog(Dictionaries.NeedleTypes)}
          />
          <Stack
            direction={isXs ? 'column' : 'row'}
            spacing={isXs ? 0 : 2}
            sx={[
              isXs && {
                flexWrap: 'wrap',
                '& > :first-child)': { mb: 2 },
              },
            ]}
          >
            <FormInputRadio
              control={control}
              name={`access.${index}.arterialNeedleSize`}
              customRadioLabelRender={customRadioLabelRender}
              label={<Typography variant="headerS">{t('form.arterialNeedleSize')}</Typography>}
              options={needleOptions}
              isDisabled={isDisabledInterface}
              sx={[
                { width: 1, '& .MuiFormGroup-root': { width: 1 } },
                isXs && { mb: 2, '& .MuiFormControlLabel-root': { mr: 0 } },
              ]}
            />
            <FormInputRadio
              control={control}
              name={`access.${index}.venousNeedleSize`}
              customRadioLabelRender={customRadioLabelRender}
              label={<Typography variant="headerS">{t('form.venousNeedleSize')}</Typography>}
              options={needleOptions}
              isDisabled={isDisabledInterface}
              sx={[
                { width: 1, '& .MuiFormGroup-root': { width: 1 } },
                isXs && { '& .MuiFormControlLabel-root': { mr: 0 } },
              ]}
            />
          </Stack>
        </Stack>
      )}
    </InfoCard>
  );
};

export default DialysisPreHdStepAccessManagement;
