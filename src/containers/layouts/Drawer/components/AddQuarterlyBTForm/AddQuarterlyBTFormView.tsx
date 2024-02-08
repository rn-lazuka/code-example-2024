import type { Control, UseFormWatch } from 'react-hook-form/dist/types/form';
import type { QuarterlyBtFormType } from '@types';
import Stack from '@mui/material/Stack';
import { FormAutocomplete, FormAutocompleteAsync } from '@components/FormComponents';
import { validatorAutocompletePattern, validatorAutocompleteRequired } from '@validators/autocomplete';
import { selectEditableLabTestPlan } from '@store/slices';
import { validatorLatinLettersNumberCharacters } from '@validators/validatorLatinLettersNumbersCharacters';
import { useProceduresOptionsList } from '@hooks/useProceduresOptionsList';
import { useTranslation } from 'react-i18next';
import { getQuarter } from 'date-fns';
import { getTenantDate } from '@utils/getTenantDate';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Quarter } from '@enums/global/Quarter';
import Skeleton from '@mui/material/Skeleton';
import isNull from 'lodash/isNull';
import { LabOrderStatus } from '@enums';

type QuarterlyBtFormViewProps = {
  control: Control<QuarterlyBtFormType>;
  watch: UseFormWatch<QuarterlyBtFormType>;
  setPatientOptions: (options: { id: string; name: string; hasQuarterlyLabOrder: boolean }[]) => void;
  patientQuarterlyBTPlanId: string | null;
  disabledPatient: boolean;
  year: number;
};
export const AddQuarterlyBTFormView = ({
  control,
  watch,
  setPatientOptions,
  patientQuarterlyBTPlanId,
  disabledPatient,
  year,
}: QuarterlyBtFormViewProps) => {
  const { procedureOptions } = useProceduresOptionsList();
  const { t } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const currentTenantQuarter = getQuarter(getTenantDate());

  const quarterlyLabTestPlan = selectEditableLabTestPlan();

  const firstQuarterOrder = quarterlyLabTestPlan?.labOrders.find(
    ({ quarterNumber }) => quarterNumber === Quarter.FIRST,
  );
  const secondQuarterOrder = quarterlyLabTestPlan?.labOrders.find(
    ({ quarterNumber }) => quarterNumber === Quarter.SECOND,
  );
  const thirdQuarterOrder = quarterlyLabTestPlan?.labOrders.find(
    ({ quarterNumber }) => quarterNumber === Quarter.THIRD,
  );
  const fourthQuarterOrder = quarterlyLabTestPlan?.labOrders.find(
    ({ quarterNumber }) => quarterNumber === Quarter.FOURTH,
  );

  const patient = watch('patient');

  const isFirstQuarterFieldDisable =
    !procedureOptions.length ||
    (firstQuarterOrder &&
      firstQuarterOrder.status !== LabOrderStatus.TO_PERFORM &&
      firstQuarterOrder.status !== LabOrderStatus.DRAFT) ||
    currentTenantQuarter > Quarter.FIRST;
  const isSecondQuarterFieldDisable =
    !procedureOptions.length ||
    (secondQuarterOrder &&
      secondQuarterOrder.status !== LabOrderStatus.TO_PERFORM &&
      secondQuarterOrder.status !== LabOrderStatus.DRAFT) ||
    currentTenantQuarter > Quarter.SECOND;
  const isThirdQuarterFieldDisable =
    !procedureOptions.length ||
    (thirdQuarterOrder &&
      thirdQuarterOrder.status !== LabOrderStatus.TO_PERFORM &&
      thirdQuarterOrder.status !== LabOrderStatus.DRAFT) ||
    currentTenantQuarter > Quarter.THIRD;
  const isFourthQuarterFieldDisable =
    !procedureOptions.length ||
    (fourthQuarterOrder &&
      fourthQuarterOrder.status !== LabOrderStatus.TO_PERFORM &&
      fourthQuarterOrder.status !== LabOrderStatus.DRAFT) ||
    currentTenantQuarter > Quarter.FOURTH;

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="labelL">{t('quarterlyWithYear', { year })}</Typography>
      <FormAutocompleteAsync
        required
        fullWidth
        isDisabled={disabledPatient}
        name="patient"
        control={control}
        label={t('forms.individualLabTestPlan.patient')}
        getOptionsUrl="/pm/patients/search/custom?fields=quarterlyLabOrderPlanId,id,name&statuses=PERMANENT,TEMPORARY_TRANSFERRED,HOSPITALIZED&name="
        optionsTransform={(options) => options.map((option) => ({ value: option.id, label: option.name }))}
        onOptionsUpdated={setPatientOptions}
        rules={{
          required: validatorAutocompleteRequired(),
        }}
      />
      {((patient && isNull(patientQuarterlyBTPlanId)) ||
        (patient && patientQuarterlyBTPlanId && !quarterlyLabTestPlan)) && (
        <Stack direction="column" spacing={2}>
          <Skeleton height={92} variant="rectangular" />
          <Skeleton height={92} variant="rectangular" />
          <Skeleton height={92} variant="rectangular" />
          <Skeleton height={92} variant="rectangular" />
        </Stack>
      )}

      {((patient && !isNull(patientQuarterlyBTPlanId) && !patientQuarterlyBTPlanId) || quarterlyLabTestPlan) && (
        <>
          <Divider />
          <Typography
            variant="labelMSB"
            sx={{
              color: ({ palette }) => palette.text.secondary,
              textTransform: 'uppercase',
            }}
          >
            {`${t('quarter')} ${Quarter.FIRST}`}
          </Typography>
          {currentTenantQuarter <= Quarter.FIRST || firstQuarterOrder ? (
            <FormAutocomplete
              required
              control={control}
              name="firstQuarterProcedure"
              label={t('forms.creation.procedure')}
              options={procedureOptions}
              isDisabled={isFirstQuarterFieldDisable}
              groupBy={(option) => option.group || ''}
              rules={{
                required: validatorAutocompleteRequired(),
                pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
              }}
            />
          ) : (
            <Typography variant="labelL">{tCommon('NA')}</Typography>
          )}
          <Divider />
          <Typography
            variant="labelMSB"
            sx={{
              color: ({ palette }) => palette.text.secondary,
              textTransform: 'uppercase',
            }}
          >
            {`${t('quarter')} ${Quarter.SECOND}`}
          </Typography>
          {currentTenantQuarter <= Quarter.SECOND || secondQuarterOrder ? (
            <FormAutocomplete
              required
              control={control}
              name="secondQuarterProcedure"
              label={t('forms.creation.procedure')}
              options={procedureOptions}
              isDisabled={isSecondQuarterFieldDisable}
              groupBy={(option) => option.group || ''}
              rules={{
                required: validatorAutocompleteRequired(),
                pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
              }}
            />
          ) : (
            <Typography variant="labelL">{tCommon('NA')}</Typography>
          )}
          <Divider />
          <Typography
            variant="labelMSB"
            sx={{
              color: ({ palette }) => palette.text.secondary,
              textTransform: 'uppercase',
            }}
          >
            {`${t('quarter')} ${Quarter.THIRD}`}
          </Typography>
          {currentTenantQuarter <= Quarter.THIRD || thirdQuarterOrder ? (
            <FormAutocomplete
              required
              control={control}
              name="thirdQuarterProcedure"
              label={t('forms.creation.procedure')}
              options={procedureOptions}
              isDisabled={isThirdQuarterFieldDisable}
              groupBy={(option) => option.group || ''}
              rules={{
                required: validatorAutocompleteRequired(),
                pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
              }}
            />
          ) : (
            <Typography variant="labelL">{tCommon('NA')}</Typography>
          )}
          <Divider />
          <Typography
            variant="labelMSB"
            sx={{
              color: ({ palette }) => palette.text.secondary,
              textTransform: 'uppercase',
            }}
          >
            {`${t('quarter')} ${Quarter.FOURTH}`}
          </Typography>
          {currentTenantQuarter <= Quarter.FOURTH || fourthQuarterOrder ? (
            <FormAutocomplete
              required
              control={control}
              name="fourthQuarterProcedure"
              label={t('forms.creation.procedure')}
              options={procedureOptions}
              isDisabled={isFourthQuarterFieldDisable}
              groupBy={(option) => option.group || ''}
              rules={{
                required: validatorAutocompleteRequired(),
                pattern: validatorAutocompletePattern(validatorLatinLettersNumberCharacters()),
              }}
            />
          ) : (
            <Typography variant="labelL">{tCommon('NA')}</Typography>
          )}
        </>
      )}
    </Stack>
  );
};
