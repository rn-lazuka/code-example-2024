import type { Dispatch, SetStateAction } from 'react';
import type { AccessForm, PreHDForm, PreDialysisRequest } from '@types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFormState } from 'react-hook-form';
import { useAppDispatch, useConfirmNavigation, usePageUnload } from '@hooks';
import { useGetNursesOptions } from '@hooks/useGetNursesOptions';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import DialysisPreHdStepAccessManagementGroup from './components/DialysisPreHdStepAccessManagementGroup';
import {
  clearDialyzersList,
  clearInitialDialysisData,
  closeDialysisModal,
  getDialysisProcessInfo,
  getDialyzersList,
  getTodayPatientsAppointments,
  openStartHDModal,
  removeServiceModal,
  saveDialysisPre,
  scrollToAccessManagementSection,
  selectAddedNewDialyzer,
  selectDialysisIsSubmitting,
  selectDialysisLoading,
  selectDialysisPatient,
  selectDialysisPre,
  selectDialyzers,
  selectIsDisableInterface,
  selectPatientId,
  startHdClick,
} from '@store';
import DialysisPreHdStepDialyzerGroup from './components/DialysisPreHdStepDialyzerGroup';
import { DialysisPatientsConditionGroup } from './components/DialysisPatientsConditionGroup';
import { DialysisBloodPressureTempGroup } from './components/DialysisBloodPressureTempGroup';
import DialysisPreHdWeightAndUfGroup from './components/DialysisPreHdStepWeightAndUfGroup';
import DialysisPreHdStepInitialInfoGroup from './components/DialysisPreHdStepInitialInfoGroup';
import { DialysisAccessConditionGroup } from './components/DialysisAccessConditionGroup';
import DialysisPreHdStepAnticoagulantGroup from './components/DialysisPreHdStepAnticoagulantGroup';
import DialysisPreHdStepDialysateGroup from './components/DialysisPreHdStepDialysateGroup';
import { ConfirmModal, GlobalLoader } from '@components';
import { format } from 'date-fns';
import { WarningIcon } from '@assets/icons';
import { ROUTES } from '@constants';
import { useLocation } from 'react-router-dom';
import {
  AccessCondition,
  DialysisSubmitSource,
  DialyzerUseType,
  Instillation,
  PatientCondition,
  ServiceModalName,
  SterilantVe,
} from '@enums';
import { CancelSaveButtonsBlock } from './components/CancelSaveButtonsBlock';
import { DialysisPreHdNote } from './components/DialysisPreHdNote';
import { Event } from '@services';
import { dateFormat } from '@utils/dateFormat';

export const getInstillationValue = (instillation) => {
  if (instillation) {
    return instillation.code === Instillation.Heparin ? Instillation.Heparin : Instillation.Others;
  }
  return Instillation.Heparin;
};

export const DialysisPreHdStep = ({
  isXs,
  setOpenStartHdModal,
}: {
  isXs: boolean;
  setOpenStartHdModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const { t: tDialyzers } = useTranslation('dialyzers');
  const preHd = selectDialysisPre();
  const location = useLocation();
  const patientId = selectPatientId();
  const isLoading = selectDialysisLoading();
  const isSubmitting = selectDialysisIsSubmitting();
  const isDisabledInterface = selectIsDisableInterface();
  const { nursesOptions, userNurse } = useGetNursesOptions();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const dialyzers = selectDialyzers();
  const dialisisPatient = selectDialysisPatient();
  const addedNewDialyzer = selectAddedNewDialyzer();

  const getPatientConditionValue = () => {
    if (preHd?.patientCondition) {
      return preHd.patientCondition === t(`form.${PatientCondition.Acceptable}`)
        ? PatientCondition.Acceptable
        : PatientCondition.SomeIssues;
    }
    return PatientCondition.Acceptable;
  };

  const getAccessConditionValue = () => {
    if (preHd?.accessCondition) {
      return preHd.accessCondition === t(`form.${AccessCondition.NoProblemsPreHd}`)
        ? AccessCondition.NoProblemsPreHd
        : AccessCondition.SomeIssues;
    }
    return AccessCondition.NoProblemsPreHd;
  };

  const setInitialInfoGroupDefaultValues = () => ({
    initialBayNumber: preHd?.initial.location?.id || '',
    initialTreatmentNumber: preHd?.initial.treatmentNumber || '',
    initialToday: preHd?.initial.today ? new Date(preHd.initial.today) : new Date(),
    initialDuration: preHd?.initial.duration || '240',
  });

  const setPreHdWeightAndUfGroupDefaultValues = () => ({
    preSessionWeight: preHd?.calculations.preSessionWeight
      ? { label: preHd.calculations.preSessionWeight, value: preHd.calculations.preSessionWeight }
      : { label: '', value: '' },
    lastSessionWeight: preHd?.calculations.lastSessionWeight || '',
    idwg: preHd?.calculations.idwg || '',
    dryWeight: preHd?.calculations.dryWeight || '',
    weightDifference: preHd?.calculations.weightDifference || '',
    reinfusionVolume: preHd?.calculations.reinfusionVolume || '300',
    flushesInfusion: preHd?.calculations.infusion || '0',
    ufTarget: preHd?.calculations?.ufTarget === undefined ? '' : preHd.calculations.ufTarget,
  });

  const setBloodPressureTempGroupDefaultValues = () => {
    const setSittingBloodPressure = (type: 'systolic' | 'diastolic') => {
      const bloodPressure =
        preHd?.indicators?.[type === 'systolic' ? 'sittingSystolicBloodPressure' : 'sittingDiastolicBloodPressure'];
      return bloodPressure || '';
    };
    return {
      sittingSystolicBloodPressure: setSittingBloodPressure('systolic'),
      sittingDiastolicBloodPressure: setSittingBloodPressure('diastolic'),
      standingSystolicBloodPressure: preHd?.indicators.standingSystolicBloodPressure || '',
      standingDiastolicBloodPressure: preHd?.indicators.standingDiastolicBloodPressure || '',
      standingPulse: preHd?.indicators.standingPulse || '',
      sittingPulse: preHd?.indicators.sittingPulse !== undefined ? preHd?.indicators.sittingPulse! : '',
      bodyTemperature: preHd?.indicators.bodyTemperature || '',
    };
  };

  const setDialysisPatientsConditionGroupDefaultValues = () => ({
    patientCondition: getPatientConditionValue(),
    patientConditionExtValue:
      preHd && preHd.patientCondition === PatientCondition.Acceptable ? '' : preHd?.patientCondition || '',
  });

  const setAccessManagementGroupDefaultValues = () => ({
    access: preHd?.accessManagements?.map(({ needle, instillation, wasUsed }) => ({
      needleType: needle?.type,
      arterialNeedleSize: needle?.arterialSize,
      venousNeedleSize: needle?.venousSize,
      instillation: getInstillationValue(instillation),
      instillationExtValue: instillation?.code === Instillation.Others ? instillation.extValue : '',
      wasUsed,
    })),
  });

  const setAccessConditionGroupDefaultValues = () => ({
    accessCondition: getAccessConditionValue(),
    accessConditionExtValue:
      preHd && preHd.accessCondition === AccessCondition.NoProblemsPreHd ? '' : preHd?.accessCondition || '',
  });

  const setAnticoagulantGroupDefaultValues = () => ({
    anticoagulantType: { label: preHd?.anticoagulant.type || '', value: preHd?.anticoagulant.type || '' },
    anticoagulantPrimeDose: preHd?.anticoagulant.primeDose || '0',
    anticoagulantBolusDose: preHd?.anticoagulant.bolusDose || '0',
    anticoagulantHourlyDose: preHd?.anticoagulant.hourlyDose || '0',
  });

  const setDialyzerGroupDefaultValues = () => {
    const usedHistoryList = preHd?.dialyzer?.history ? preHd?.dialyzer?.history.filter(({ used }) => used) : [];

    const dialyzerLabel = `${preHd?.dialyzer?.brand?.name} (${preHd?.dialyzer?.surfaceArea} ${tDialyzers(
      'tableView.m2',
    )}) - ${usedHistoryList.length ? dateFormat(usedHistoryList[0].date) : tDialyzers('tableView.new')}`;
    const historyItem =
      preHd?.dialyzer?.history && preHd.dialyzer.history.find(({ dialysisId }) => dialysisId === preHd.id);

    return {
      patientDialyzer: preHd?.dialyzer?.id
        ? {
            label: dialyzerLabel,
            value: preHd.dialyzer.id,
            history: preHd?.dialyzer?.history || [],
          }
        : null,
      dialyzerReuseNum: '',
      disposeAfterwards: !!preHd?.dialyzer?.disposeAfterwards,
      sterilantVe: !!historyItem?.beforeSterilant?.test,
      dialyzerTestedBy: {
        label: historyItem?.beforeSterilant?.testedBy?.name || userNurse?.name || '',
        value: historyItem?.beforeSterilant?.testedBy?.id || userNurse?.id || '',
      },
      residualVe: !!historyItem?.afterSterilant?.test,
      residualTestedBy: {
        label: historyItem?.afterSterilant?.testedBy?.name || userNurse?.name || '',
        value: historyItem?.afterSterilant?.testedBy?.id || userNurse?.id || '',
      },
      dialyzerPrimedBy: {
        label: historyItem?.primedBy?.name || userNurse?.name || '',
        value: historyItem?.primedBy?.id || userNurse?.id || '',
      },
      dialyzerSterilantVeComment: historyItem?.comment || '',
    };
  };

  const setDialysateGroupDefaultValues = () => ({
    dialysateCalcium: preHd?.dialysate.calcium || '0',
    dialysateSodiumStart: preHd?.dialysate.sodiumStart || '0',
    dialysateSodiumEnd: preHd?.dialysate.sodiumEnd || '0',
    dialysatePotassium: preHd?.dialysate.potassium || '0',
    dialysateTemperature: preHd?.dialysate.temperature || '',
    dialysateFlow: preHd?.dialysate.flow || '',
  });

  const defaultValues: PreHDForm = useMemo(
    () => ({
      ...setInitialInfoGroupDefaultValues(),
      ...setPreHdWeightAndUfGroupDefaultValues(),
      ...setBloodPressureTempGroupDefaultValues(),
      ...setDialysisPatientsConditionGroupDefaultValues(),
      ...setAccessManagementGroupDefaultValues(),
      ...setAccessConditionGroupDefaultValues(),
      ...setAnticoagulantGroupDefaultValues(),
      ...setDialyzerGroupDefaultValues(),
      ...setDialysateGroupDefaultValues(),
      notes: preHd?.notes || '',
    }),
    [preHd],
  );
  const { handleSubmit, control, watch, trigger, setValue, reset } = useForm<PreHDForm>({
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });
  const patientDialyzer = watch('patientDialyzer');

  useEffect(() => {
    if (patientDialyzer && preHd?.dialyzer?.disposeAfterwards === undefined) {
      const usedHistoryList = patientDialyzer.history.filter(({ used }) => used);
      if (usedHistoryList.length === 0 && patientDialyzer.label.includes(tDialyzers('tableView.single'))) {
        setValue('disposeAfterwards', true);
      } else {
        setValue('disposeAfterwards', false);
      }
    }
  }, [patientDialyzer]);

  useEffect(() => {
    preHd && reset(defaultValues);
  }, [preHd]);

  useEffect(() => {
    if (addedNewDialyzer) {
      const usedHistoryList = addedNewDialyzer.history ? addedNewDialyzer.history.filter(({ used }) => used) : [];
      const dialyzerLabel = `${addedNewDialyzer.brand.name} (${addedNewDialyzer.surfaceArea} ${tDialyzers(
        'tableView.m2',
      )}) - ${usedHistoryList.length ? dateFormat(usedHistoryList[0].date) : tDialyzers('tableView.new')}`;
      const value = {
        label: dialyzerLabel,
        value: addedNewDialyzer.id,
        history: addedNewDialyzer.history,
      };
      setValue('patientDialyzer', value);
    }
  }, [addedNewDialyzer]);

  const { isDirty, isValid, touchedFields } = useFormState({ control });

  useEffect(() => {
    const openStartHdModal = () => setOpenStartHdModal(true);
    Event.subscribe(openStartHDModal.type, openStartHdModal);
    return () => Event.unsubscribe(openStartHDModal.type, openStartHdModal);
  }, []);

  useEffect(() => {
    dispatch(getDialyzersList(dialisisPatient.id));
    return () => {
      dispatch(clearDialyzersList());
    };
  }, [dialisisPatient]);

  useEffect(() => {
    const onStartHdClick = () => {
      if (!isValid || isDirty) {
        onSubmit({ source: DialysisSubmitSource.HEADER });
      } else {
        setOpenStartHdModal(true);
      }
    };
    Event.subscribe(startHdClick.type, onStartHdClick);
    return () => Event.unsubscribe(startHdClick.type, onStartHdClick);
  }, [isValid, isDirty]);

  useEffect(() => {
    const onCloseDialysisModal = () => (isDirty ? setOpenConfirmModal(true) : handleConfirmClose());
    Event.subscribe(closeDialysisModal.type, onCloseDialysisModal);
    return () => Event.unsubscribe(closeDialysisModal.type, onCloseDialysisModal);
  }, [isDirty]);

  useEffect(() => {
    const handler = () => {
      document.querySelector('[data-testid="dialysisPreHdStepAccessManagement"]')?.scrollIntoView({
        behavior: 'smooth',
      });
    };

    Event.subscribe(scrollToAccessManagementSection.type, handler);
    return () => {
      Event.unsubscribe(scrollToAccessManagementSection.type, handler);
    };
  }, []);

  const onSubmit = ({ source }: { source: DialysisSubmitSource }) => {
    handleSubmit((data) => {
      const prepareAccessManagementsData = (access: AccessForm, index: number) => {
        let commonData = {
          accessCategory: preHd?.accessManagements[index].accessCategory,
          side: preHd?.accessManagements[index].side,
          comments: preHd?.accessManagements[index]?.comments,
          id: preHd?.accessManagements[index]?.id,
          wasUsed: (data.access.length === 1 && !access.wasUsed) || access.wasUsed,
        };
        const accessWithInstillation = {
          insertionDate: preHd?.accessManagements[index].insertionDate,
          cvcCategory: preHd?.accessManagements[index].category,
          instillation: {
            code: access.instillation,
            extValue: access.instillationExtValue,
          },
          arterialVolume: preHd?.accessManagements[index].arterialVolume,
          venousVolume: preHd?.accessManagements[index].venousVolume,
        };
        const accessWithoutInstillation = {
          creationDate: preHd?.accessManagements[index].creationDate,
          createdAtPlace: preHd?.accessManagements[index].createdAtPlace,
          createdAtPlaceBy: preHd?.accessManagements[index].createdAtPlaceBy,
          type: preHd?.accessManagements[index].type,
          note: preHd?.accessManagements[index].note,
          needle: {
            type: access.needleType!,
            arterialSize: access.arterialNeedleSize!,
            venousSize: access.venousNeedleSize!,
          },
        };
        if ('instillation' in access) {
          return { ...commonData, ...accessWithInstillation };
        } else {
          return { ...commonData, ...accessWithoutInstillation };
        }
      };
      const accessManagements = data.access.map((access, index) => {
        return prepareAccessManagementsData(access, index);
      });

      const preparedData: PreDialysisRequest = {
        initial: {
          locationId: data.initialBayNumber,
          dialysisDate: format(data.initialToday, 'yyyy-MM-dd'),
          duration: data.initialDuration,
          treatmentNumber: data.initialTreatmentNumber,
        },
        calculations: {
          preSessionWeight: data.preSessionWeight.value,
          lastSessionWeight: data.lastSessionWeight,
          idwg: data.idwg,
          dryWeight: data.dryWeight,
          weightDifference: data.weightDifference,
          reinfusionVolume: data.reinfusionVolume,
          infusion: data.flushesInfusion,
          ufTarget: data.ufTarget,
        },
        indicators: {
          standingSystolicBloodPressure: data.standingSystolicBloodPressure,
          standingDiastolicBloodPressure: data.standingDiastolicBloodPressure,
          standingPulse: data.standingPulse,
          sittingSystolicBloodPressure: data.sittingSystolicBloodPressure,
          sittingDiastolicBloodPressure: data.sittingDiastolicBloodPressure,
          sittingPulse: data.sittingPulse,
          bodyTemperature: data.bodyTemperature,
        },
        patientCondition: data.patientCondition === PatientCondition.Acceptable ? '' : data.patientConditionExtValue,
        accessManagements,
        accessCondition: data.accessCondition === AccessCondition.NoProblemsPostHd ? '' : data.accessConditionExtValue,
        anticoagulant: {
          type: data.anticoagulantType?.value,
          primeDose: data.anticoagulantPrimeDose,
          bolusDose: data.anticoagulantBolusDose,
          hourlyDose: data.anticoagulantHourlyDose,
        },
        dialyzer: {
          id: data.patientDialyzer!.value,
          primedBy: data.dialyzerPrimedBy.value,
          comment: data?.dialyzerSterilantVeComment,
          disposeAfterwards: data?.disposeAfterwards,
          ...(data?.dialyzerReuseNum > 1
            ? {
                beforeSterilant: {
                  test: SterilantVe.NEG_VE,
                  testedBy: data?.dialyzerTestedBy ? data?.dialyzerTestedBy.value : '',
                },
                afterSterilant: {
                  test: SterilantVe.POS_VE,
                  testedBy: data?.residualTestedBy ? data.residualTestedBy.value : '',
                },
              }
            : {}),
        },
        dialysate: {
          calcium: data.dialysateCalcium,
          sodiumStart: data.dialysateSodiumStart,
          sodiumEnd: data.dialysateSodiumEnd,
          potassium: data.dialysatePotassium,
          temperature: data.dialysateTemperature,
          flow: data.dialysateFlow,
        },
        notes: data.notes,
        source,
      };

      isValid && dispatch(saveDialysisPre(preparedData));
    })();
  };

  useConfirmNavigation(isDirty, []);
  usePageUnload(isDirty, tCommon('dataLost'));

  const handleConfirmClose = () => {
    if (location.pathname === ROUTES.todayPatients) {
      dispatch(getTodayPatientsAppointments());
    } else if (patientId) {
      dispatch(getDialysisProcessInfo(patientId));
    }

    dispatch(clearInitialDialysisData());
    dispatch(removeServiceModal(ServiceModalName.DialysisProcedureModal));
  };

  const resetValues = useCallback(() => reset(defaultValues), [defaultValues]);

  const onFormSubmit = useCallback(() => {
    onSubmit({ source: DialysisSubmitSource.FORM });
  }, [isValid, preHd]);

  if (isLoading)
    return (
      <Backdrop
        sx={(theme) => ({ color: theme.palette.primary[100], zIndex: theme.zIndex.snackbar + 1 })}
        open
        data-testid="dialysisPreHdStep"
      >
        <GlobalLoader />
      </Backdrop>
    );

  return (
    <>
      <ConfirmModal
        onClose={() => setOpenConfirmModal(false)}
        title={tCommon('closeWithoutSaving')}
        text={tCommon('dataLost')}
        icon={WarningIcon}
        confirmButton={{ children: tCommon('button.continue'), onClick: handleConfirmClose }}
        cancelButton={{ children: tCommon('button.cancel') }}
        isOpen={openConfirmModal}
      />
      <Stack
        direction="column"
        spacing={2}
        sx={{
          pt: 2,
          px: isXs ? 2 : 0,
          pb: (theme) => theme.spacing(isXs ? 11.25 : 7),
          maxWidth: (theme) => theme.spacing(87),
          width: 1,
          mx: 'auto',
          position: 'relative',
        }}
      >
        <DialysisPreHdStepInitialInfoGroup control={control} watch={watch} trigger={trigger} isXs={isXs} />
        <DialysisPreHdWeightAndUfGroup
          control={control}
          watch={watch}
          setValue={setValue}
          trigger={trigger}
          defaultIDWG={preHd?.calculations.idwg || ''}
        />
        <DialysisBloodPressureTempGroup control={control} isXs={isXs} />
        <DialysisPatientsConditionGroup control={control} watch={watch} isXs={isXs} />
        <DialysisPreHdStepAccessManagementGroup
          control={control}
          watch={watch}
          accessManagements={preHd?.accessManagements}
        />
        <DialysisAccessConditionGroup control={control} watch={watch} isXs={isXs} />
        <DialysisPreHdStepAnticoagulantGroup control={control} isXs={isXs} />
        <DialysisPreHdStepDialyzerGroup
          control={control}
          watch={watch}
          setValue={setValue}
          nursesOptions={nursesOptions}
          dialyzers={dialyzers}
          id={preHd?.id}
          isXs={isXs}
        />
        <DialysisPreHdStepDialysateGroup control={control} isXs={isXs} />
        <DialysisPreHdNote control={control} isXs={isXs} />
        {!isDisabledInterface && isDirty && !!Object.keys(touchedFields).length && (
          <CancelSaveButtonsBlock
            isXs={isXs}
            reset={resetValues}
            onSubmit={onFormSubmit}
            isSubmitting={isSubmitting}
            saveButtonLabel={t('buttons.saveChanges')}
          />
        )}
      </Stack>
    </>
  );
};
