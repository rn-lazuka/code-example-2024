import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form/dist/types/form';
import type { Dialyzers, Option, PreHDForm } from '@types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';
import { FormInputText, InfoCard, FormInputCheckbox, FormAutocomplete } from '@components';
import {
  validatorLatinLettersNumberCharacters,
  validatorMaxLength,
  validatorMinLength,
  validatorRequired,
  validatorAutocompleteRequired,
} from '@validators';
import { dateFormat, dateToServerFormat, getTenantDate } from '@utils';
import { DialyzerStatuses, ServiceModalName, UserPermissions } from '@enums';
import { selectDialysisPatient, selectIsDisableInterface } from '@store/slices/dialysisSlice';
import { addServiceModal, selectUser, selectUserPermissions } from '@store/slices';
import { useAppDispatch } from '@hooks/storeHooks';
import { AddDialyzerModalPlace } from '@enums/components/AddDialyzerModalPlace';
import Button from '@mui/material/Button';

type DialysisPreHdStepDialyzerGroupProps = {
  control: Control<PreHDForm>;
  watch: UseFormWatch<PreHDForm>;
  setValue: UseFormSetValue<PreHDForm>;
  nursesOptions: Option[];
  dialyzers: Dialyzers[];
  id?: string;
  isXs: boolean;
};

const DialysisPreHdStepDialyzerGroup = ({
  control,
  watch,
  setValue,
  nursesOptions,
  dialyzers = [],
  id,
  isXs,
}: DialysisPreHdStepDialyzerGroupProps) => {
  const [dialyzersOptions, setDialyzersOptions] = useState<Option[]>([]);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('dialysis');
  const { t: tDialyzers } = useTranslation('dialyzers');
  const user = selectUser();
  const isDisabledInterface = selectIsDisableInterface();
  const { id: patientId } = selectDialysisPatient();
  const userPermissions = selectUserPermissions();

  const sterilantVeField = watch('sterilantVe');
  const residualVeField = watch('residualVe');
  const dialyzerReuseNum = watch('dialyzerReuseNum');
  const patientDialyzer = watch('patientDialyzer');
  const dialyzerPrimedBy = watch('dialyzerPrimedBy');
  const dialyzerTestedBy = watch('dialyzerTestedBy');
  const residualTestedBy = watch('residualTestedBy');

  useEffect(() => {
    if (dialyzers.length) {
      setDialyzersOptions(
        dialyzers
          .filter((dialyzer) => dialyzer.status === DialyzerStatuses.ACTIVE)
          .map(({ id, brand, surfaceArea, history }) => ({
            label: `${brand?.name} (${surfaceArea} ${tDialyzers('tableView.m2')}) - ${
              history && !!history.length ? dateFormat(history[0].date) : tDialyzers('tableView.new')
            }`,
            value: id,
            history: history.map((item) => ({ ...item, used: true })),
          })),
      );
    }
  }, [dialyzers]);

  useEffect(() => {
    if (nursesOptions.length) {
      const userNurses = nursesOptions.find(({ userId }) => userId === user?.id);
      userNurses && !dialyzerPrimedBy?.value && setValue('dialyzerPrimedBy', userNurses);
      userNurses && !dialyzerTestedBy?.value && setValue('dialyzerTestedBy', userNurses);
      userNurses && !residualTestedBy?.value && setValue('residualTestedBy', userNurses);
    }
  }, [dialyzerPrimedBy, dialyzerTestedBy, residualTestedBy, nursesOptions]);

  const openAddNewDialyzer = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.AddDialyzerModal,
        payload: {
          place: AddDialyzerModalPlace.PRE_HD_STEP,
          patientId,
        },
      }),
    );
  };

  useEffect(() => {
    if (patientDialyzer) {
      const usedCount = patientDialyzer.history.filter(
        ({ used, dialysisId, date }) => used && id !== dialysisId && date !== dateToServerFormat(getTenantDate()),
      ).length;
      setValue('dialyzerReuseNum', usedCount + 1);
    }
  }, [patientDialyzer]);

  return (
    <InfoCard title={t('form.dialyzer')} isXs={isXs}>
      <Grid container rowSpacing={2} columnSpacing={2}>
        <Grid item xs={12}>
          <Typography variant="headerS">{t('form.usedDialyzer')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormAutocomplete
            required
            control={control}
            name="patientDialyzer"
            options={dialyzersOptions}
            label={t('form.patientDialyzers')}
            isDisabled={isDisabledInterface}
            rules={{
              required: validatorAutocompleteRequired(),
            }}
          />
        </Grid>
        {patientDialyzer && (
          <>
            <Grid item container xs={12} sm={3}>
              <Grid item xs={6} sm={12}>
                <FormInputText control={control} name="dialyzerReuseNum" label={t('form.useNum')} isDisabled />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormInputCheckbox
                control={control}
                name="disposeAfterwards"
                label={tDialyzers('disposeOfAfterUse')}
                isDisabled={!userPermissions.includes(UserPermissions.DialyzerManage)}
                sx={{ mb: isXs ? 0 : 2, mt: isXs ? 0 : 2 }}
              />
            </Grid>
            {!isXs && <Grid item xs={12} sm={2} />}
            <Grid item xs={12} sm={3} sx={{ lineHeight: '56px' }}>
              <Button
                onClick={openAddNewDialyzer}
                sx={[isXs && { width: '100%' }]}
                variant="outlined"
                data-testid="addNewDialyzerButton"
              >
                {t('addNewDialyzer')}
              </Button>
            </Grid>
          </>
        )}
        {!patientDialyzer && (
          <Grid container item xs={12} direction="row-reverse">
            <Grid item xs={12} sm={3} sx={{ lineHeight: '56px' }}>
              <Button
                onClick={openAddNewDialyzer}
                sx={[isXs && { width: '100%' }]}
                variant="outlined"
                data-testid="addNewDialyzerButton"
              >
                {t('addNewDialyzer')}
              </Button>
            </Grid>
          </Grid>
        )}

        {dialyzerReuseNum > 1 && (
          <>
            <Grid item xs={12}>
              <Typography variant="headerS" sx={{ mt: 1, color: (theme) => theme.palette.text.black }}>
                {t('form.dialyzerSterilant')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormInputCheckbox
                control={control}
                name="sterilantVe"
                label={t('form.vePlusCanBeUsed')}
                isDisabled={isDisabledInterface}
                required
                rules={{
                  required: validatorRequired(),
                }}
              />
            </Grid>
            {sterilantVeField && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormAutocomplete
                    required
                    control={control}
                    name="dialyzerTestedBy"
                    options={nursesOptions}
                    label={t('form.testedBy')}
                    isDisabled={isDisabledInterface}
                    rules={{
                      required: validatorAutocompleteRequired(),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInputCheckbox
                    control={control}
                    name="residualVe"
                    label={t('form.veMinusCanBeUsed')}
                    isDisabled={isDisabledInterface}
                    required
                    rules={{
                      required: validatorRequired(),
                    }}
                  />
                </Grid>
                {residualVeField && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormAutocomplete
                        required
                        control={control}
                        name="residualTestedBy"
                        options={nursesOptions}
                        label={t('form.testedBy')}
                        isDisabled={isDisabledInterface}
                        rules={{
                          required: validatorAutocompleteRequired(),
                        }}
                      />
                    </Grid>
                    <Grid container item xs={12} columnSpacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormAutocomplete
                          required
                          control={control}
                          name="dialyzerPrimedBy"
                          options={nursesOptions}
                          label={t('form.primedBy')}
                          isDisabled={isDisabledInterface}
                          rules={{
                            required: validatorAutocompleteRequired(),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </>
            )}
          </>
        )}
        {patientDialyzer && (
          <>
            {dialyzerReuseNum === 1 && (
              <Grid item xs={12} sm={6}>
                <FormAutocomplete
                  required
                  control={control}
                  name="dialyzerPrimedBy"
                  options={nursesOptions}
                  label={t('form.primedBy')}
                  isDisabled={isDisabledInterface}
                  rules={{
                    required: validatorAutocompleteRequired(),
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormInputText
                control={control}
                name="dialyzerSterilantVeComment"
                label={t('form.comments')}
                isDisabled={isDisabledInterface}
                rules={{
                  minLength: validatorMinLength(2, 500),
                  maxLength: validatorMaxLength(2, 500),
                  pattern: validatorLatinLettersNumberCharacters(),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </InfoCard>
  );
};

export default DialysisPreHdStepDialyzerGroup;
