import type { CreateQuarterlyBTForm, QuarterlyBtFormType } from '@types';
import { useEffect, useMemo, useState } from 'react';
import { AddQuarterlyBTFormView } from '@containers/layouts/Drawer/components/AddQuarterlyBTForm/AddQuarterlyBTFormView';
import { useAppDispatch } from '@hooks/storeHooks';
import { useTranslation } from 'react-i18next';
import {
  addServiceModal,
  clearEditableLabTestPlan,
  getLabTestPlan,
  removeDrawer,
  selectDrawerPayload,
  selectEditableLabTestPlan,
  selectLabOrdersIsSubmitting,
  submitLabOrderForm,
  updateDrawer,
} from '@store/slices';
import { DrawerType, FormType } from '@enums/containers';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { LabOrderEventPlace, ServiceModalName } from '@enums/components';
import { useForm, useFormState } from 'react-hook-form';
import { LabTestTypes } from '@enums/pages';
import { Quarter } from '@enums/global/Quarter';
import CircularProgress from '@mui/material/CircularProgress';
import { getQuarter } from 'date-fns';
import { getTenantDate } from '@utils/getTenantDate';

export const AddQuarterlyBTForm = () => {
  const [patientOptions, setPatientOptions] = useState<
    { id: string; name: string; quarterlyLabOrderPlanId?: string }[]
  >([]);
  const [patientQuarterlyBTPlanId, setPatientQuarterlyBTPlanId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('labOrders');
  const { place, mode, disabledPatient, formInitialValues } = selectDrawerPayload(DrawerType.QuarterlyBT);
  const isSubmitting = selectLabOrdersIsSubmitting();
  const quarterlyLabTestPlan = selectEditableLabTestPlan();
  const currentTenantQuarter = getQuarter(getTenantDate());

  const defaultValues = useMemo(() => {
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

    return {
      patient:
        formInitialValues.patient ||
        (quarterlyLabTestPlan
          ? { label: quarterlyLabTestPlan?.patientName, value: quarterlyLabTestPlan?.patientId }
          : null),
      firstQuarterProcedure:
        firstQuarterOrder &&
        (!firstQuarterOrder?.procedureDeleted ||
          (currentTenantQuarter > Quarter.FIRST && firstQuarterOrder?.procedureDeleted))
          ? {
              label: firstQuarterOrder.procedureName,
              value: firstQuarterOrder.procedureId,
              status: firstQuarterOrder.status,
            }
          : null,
      secondQuarterProcedure:
        secondQuarterOrder &&
        (!secondQuarterOrder?.procedureDeleted ||
          (currentTenantQuarter! > Quarter.SECOND && secondQuarterOrder?.procedureDeleted))
          ? {
              label: secondQuarterOrder.procedureName,
              value: secondQuarterOrder.procedureId,
              status: secondQuarterOrder.status,
            }
          : null,
      thirdQuarterProcedure:
        thirdQuarterOrder &&
        (!thirdQuarterOrder?.procedureDeleted ||
          (currentTenantQuarter! > Quarter.THIRD && thirdQuarterOrder?.procedureDeleted))
          ? {
              label: thirdQuarterOrder.procedureName,
              value: thirdQuarterOrder.procedureId,
              status: thirdQuarterOrder.status,
            }
          : null,
      fourthQuarterProcedure:
        fourthQuarterOrder &&
        (!fourthQuarterOrder?.procedureDeleted ||
          (currentTenantQuarter! > Quarter.FOURTH && fourthQuarterOrder?.procedureDeleted))
          ? {
              label: fourthQuarterOrder.procedureName,
              value: fourthQuarterOrder.procedureId,
              status: fourthQuarterOrder.status,
            }
          : null,
    };
  }, [quarterlyLabTestPlan]);

  const { control, handleSubmit, watch, setValue, reset } = useForm<QuarterlyBtFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });

  const patient = watch('patient');

  useEffect(() => {
    if (patientOptions.length) {
      dispatch(clearEditableLabTestPlan());
      const patientOption = patientOptions.find(({ id }) => id === patient?.value);
      setPatientQuarterlyBTPlanId(patientOption?.quarterlyLabOrderPlanId || '');
    }
  }, [patientOptions]);

  useEffect(() => {
    if (patientQuarterlyBTPlanId) {
      if (mode === FormType.Add) {
        dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(getLabTestPlan(patientQuarterlyBTPlanId)),
              cancelCallback: () => {
                place === LabOrderEventPlace.LabOrders
                  ? setValue('patient', { label: '', value: '' })
                  : dispatch(removeDrawer(DrawerType.QuarterlyBT));
              },
              title: t('quarterlyBTAlreadyCreated', { name: patient?.label }),
              text: t('editIt'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        );
      } else {
        dispatch(getLabTestPlan(patientQuarterlyBTPlanId));
      }
    }
  }, [patientQuarterlyBTPlanId]);

  useEffect(() => {
    return () => {
      dispatch(clearEditableLabTestPlan());
    };
  }, []);

  useEffect(() => {
    quarterlyLabTestPlan && reset(defaultValues);
  }, [quarterlyLabTestPlan]);

  useEffect(() => {
    dispatch(updateDrawer({ type: DrawerType.QuarterlyBT, statuses: { isDirty } }));
    return () => {
      dispatch(updateDrawer({ type: DrawerType.QuarterlyBT, statuses: { isDirty: false } }));
    };
  }, [isDirty]);

  const handleClose = () => {
    isDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeDrawer(DrawerType.QuarterlyBT)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
            },
          }),
        )
      : dispatch(removeDrawer(DrawerType.QuarterlyBT));
  };

  const onSubmit = (data) => {
    const params: CreateQuarterlyBTForm = {
      patientId: data.patient.value,
      quarters: [
        { number: Quarter.FIRST, procedureId: data?.firstQuarterProcedure?.value },
        { number: Quarter.SECOND, procedureId: data?.secondQuarterProcedure?.value },
        { number: Quarter.THIRD, procedureId: data?.thirdQuarterProcedure?.value },
        { number: Quarter.FOURTH, procedureId: data?.fourthQuarterProcedure?.value },
      ].filter(({ procedureId }) => procedureId),
    };
    dispatch(
      submitLabOrderForm({
        type: LabTestTypes.Quarterly,
        place,
        id: quarterlyLabTestPlan?.planId,
        formData: params,
        mode: quarterlyLabTestPlan ? FormType.Edit : FormType.Add,
      }),
    );
  };

  return (
    <Stack direction="column" pb={8.5}>
      <AddQuarterlyBTFormView
        control={control}
        watch={watch}
        setPatientOptions={setPatientOptions}
        patientQuarterlyBTPlanId={patientQuarterlyBTPlanId}
        disabledPatient={disabledPatient}
        year={
          !quarterlyLabTestPlan?.createdAt
            ? new Date().getFullYear()
            : new Date(quarterlyLabTestPlan.createdAt).getFullYear()
        }
      />
      <Box
        sx={(theme) => ({
          px: 1,
          py: 1,
          bgcolor: theme.palette.surface.default,
          borderTop: `solid 1px ${theme.palette.border.default}`,
          position: 'absolute',
          bottom: 0,
          width: `calc(100% - ${theme.spacing(4.5)})`,
          zIndex: theme.zIndex.drawer,
        })}
      >
        <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} variant={'outlined'}>
            {tCommon('button.cancel')}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant={'contained'} disabled={isSubmitting}>
            {tCommon('button.save')}
            {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default AddQuarterlyBTForm;
