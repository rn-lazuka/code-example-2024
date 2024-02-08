import { PatientStatusDeadFormView } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/components/PatientStatusDeadFormView';
import { PatientStatusDefaultFormView } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/components/PatientStatusDefaultFormView';
import { PatientStatusDischargedFormView } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/components/PatientStatusDischargedFormView';
import { PatientStatusHospitalizedFormView } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/components/PatientStatusHospitalizedFormView';
import { PatientStatusPermanentFormView } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/components/PatientStatusPermanentFormView';
import { PatientStatusTemporaryTransferredFormView } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/components/PatientStatusTransferredFormView';
import { PatientStatusVisitingFormView } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/components/PatientStatusVisitingFormView';
import { PatientStatusWalkInFormView } from '@components/modals/ServiceModal/components/PatientChangeStatusModal/components/components/PatientStatusWalkInFormView';
import { MALAYSIA_PHONE_CODE } from '@constants/components';
import { FileTypes, NoticeBlockType, PatientHospitalizationReason, PatientStatuses, ServiceModalName } from '@enums';
import { usePageUnload } from '@hooks';
import { useAppDispatch } from '@hooks/storeHooks';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { Event } from '@services/Event/Event';
import { addServiceModal, changePatientStatus, removeServiceModal, selectPatientLoading } from '@store/slices';
import { FileDocument, PatientStatusForm } from '@types';
import { capitalize, Dictionaries, getTenantStartCurrentDay } from '@utils';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';

interface PatientChangeStatusDefaultFormValues {
  createdAt: string;
  files: FileDocument[];
  status: PatientStatuses;
  statusId: number;
  updatedAt: string;
}

type PatientChangeStatusFormProps = {
  patientId: string | number;
  statusId: number | string | null;
  isHistory: boolean;
  defaultFormValues?: Partial<PatientStatusForm> & Partial<PatientChangeStatusDefaultFormValues>;
  currentPatientStatus: PatientStatuses;
  availableStatuses: PatientStatuses[];
  onCancel: () => void;
};

export const PatientChangeStatusForm = ({
  patientId,
  isHistory,
  statusId,
  currentPatientStatus,
  defaultFormValues = {},
  availableStatuses,
  onCancel = () => {},
}: PatientChangeStatusFormProps) => {
  const dispatch = useAppDispatch();
  const { t: tCommon } = useTranslation('common');
  const { t: tPatient } = useTranslation('patient');
  const { t: tPatientStatuses } = useTranslation(Dictionaries.PatientStatuses);
  const isLoading = selectPatientLoading();

  const [fileLoadingCount, setFileLoadingCount] = useState(0);
  const [warningText, setWarningText] = useState('');

  const defaultValues: PatientStatusForm = {
    status: currentPatientStatus,
    reason: PatientHospitalizationReason.UNKNOWN,
    details: undefined,
    [FileTypes.DischargeNotes]:
      defaultFormValues.status === PatientStatuses.Hospitalized && defaultFormValues?.files
        ? defaultFormValues.files
        : [],
    [FileTypes.IdentityDocument]: defaultFormValues?.[FileTypes.IdentityDocument] || [],
    [FileTypes.DeathProof]:
      defaultFormValues.status === PatientStatuses.Dead && defaultFormValues?.files ? defaultFormValues.files : [],
    [FileTypes.VirologyStatus]:
      defaultFormValues.status === PatientStatuses.Permanent && defaultFormValues?.files ? defaultFormValues.files : [],
    [FileTypes.MedicalReport]: defaultFormValues?.[FileTypes.MedicalReport] || [],
    [FileTypes.Consultation]: defaultFormValues?.[FileTypes.Consultation] || [],
    [FileTypes.BloodTest]: defaultFormValues?.[FileTypes.BloodTest] || [],
    [FileTypes.HdPrescription]: defaultFormValues?.[FileTypes.HdPrescription] || [],
    [FileTypes.Other]: defaultFormValues?.[FileTypes.Other] || [],
    deathDate: defaultFormValues?.deathDate ? new Date(defaultFormValues?.deathDate) : getTenantStartCurrentDay(),
    comment: defaultFormValues?.comment || '',
    ...defaultFormValues,
    returningDate: defaultFormValues?.returningDate
      ? new Date(defaultFormValues?.returningDate)
      : getTenantStartCurrentDay(),
    genderCode: defaultFormValues?.genderCode ?? '',
    genderExtValue: defaultFormValues?.genderExtValue ?? '',
    kins: defaultFormValues?.kins || [
      {
        name: '',
        relationship: '',
        phone: {
          countryCode: MALAYSIA_PHONE_CODE,
          number: '',
        },
      },
    ],
    clinic: defaultFormValues?.clinic ? defaultFormValues?.clinic : '',
  };

  const { handleSubmit, watch, setValue, register, control, reset } = useForm<PatientStatusForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const { isDirty, isSubmitting } = useFormState({ control });

  const selectedPatientStatus = watch('status');
  const gender = watch('genderCode');
  const kins = watch('kins');
  const selectedReason = watch('reason');

  usePageUnload(isDirty, tCommon('dataLost'));

  const openCancellationModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => {
            dispatch(removeServiceModal(ServiceModalName.PatientStatusModal));
          },
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };

  useEffect(() => {
    const onClosePatientChangeStatusModal = () =>
      isDirty ? openCancellationModal() : dispatch(removeServiceModal(ServiceModalName.PatientStatusModal));
    Event.subscribe('closePatientStatusModal', onClosePatientChangeStatusModal);
    return () => Event.unsubscribe('closePatientStatusModal', onClosePatientChangeStatusModal);
  }, [isDirty]);

  const onSubmit = (data: PatientStatusForm) => {
    const files = [
      ...data[FileTypes.DeathProof],
      ...data[FileTypes.IdentityDocument],
      ...data[FileTypes.DischargeNotes],
      ...data[FileTypes.VirologyStatus],
      ...data[FileTypes.MedicalReport],
      ...data[FileTypes.Consultation],
      ...data[FileTypes.BloodTest],
      ...data[FileTypes.HdPrescription],
      ...data[FileTypes.Other],
    ];
    const preparedFiles = files.map(({ id, size, name, type, tempKey }) => {
      const file: any = {
        name,
        type: data.status === PatientStatuses.Walk_In ? type : FileTypes.Status,
      };
      if (tempKey) {
        file.tempKey = tempKey;
      } else {
        file.id = id;
        file.size = size;
      }
      return file;
    }) as FileDocument[];
    dispatch(
      changePatientStatus({
        patientId,
        isHistory,
        statusId,
        status: data.status,
        reason: data?.reason && data.status === PatientStatuses.Hospitalized ? data.reason : null,
        comment: data?.comment || '',
        files: preparedFiles?.length ? preparedFiles : null,
        details: data?.details || '',
        deathDate:
          data?.deathDate && data.status === PatientStatuses.Dead ? format(data.deathDate, 'yyyy-MM-dd') : null,
        returningDate:
          data?.returningDate &&
          (data.status === PatientStatuses.Hospitalized || data.status === PatientStatuses.Temporary_Transferred)
            ? format(data.returningDate, 'yyyy-MM-dd')
            : null,
        gender: data?.genderCode
          ? {
              code: data.genderCode,
              extValue: data?.genderExtValue || '',
            }
          : null,
        family:
          currentPatientStatus === PatientStatuses.Walk_In &&
          (selectedPatientStatus === PatientStatuses.Permanent || selectedPatientStatus === PatientStatuses.Visiting)
            ? {
                kins: data.kins.map(({ name, phone, relationship }) => ({
                  name: capitalize(name),
                  phone,
                  relationship,
                })),
              }
            : undefined,
        clinic: data?.clinic || '',
      }),
    );
  };

  const warningTextChangeHandler = () => {
    if (currentPatientStatus === PatientStatuses.Discharged && selectedPatientStatus === PatientStatuses.Walk_In) {
      setWarningText(
        tPatient('statusModal.changeStatusWarningText', { status: tPatient(`filter.${PatientStatuses.Walk_In}`) }),
      );
      return;
    }
    if (
      (currentPatientStatus === PatientStatuses.Permanent || currentPatientStatus === PatientStatuses.Visiting) &&
      selectedPatientStatus === PatientStatuses.Discharged
    ) {
      setWarningText(
        tPatient('statusModal.changeStatusWarningText', { status: tPatient(`filter.${PatientStatuses.Discharged}`) }),
      );
      return;
    }
    if (
      (currentPatientStatus === PatientStatuses.Permanent ||
        currentPatientStatus === PatientStatuses.Visiting ||
        currentPatientStatus === PatientStatuses.Hospitalized ||
        currentPatientStatus === PatientStatuses.Temporary_Transferred) &&
      selectedPatientStatus === PatientStatuses.Dead
    ) {
      setWarningText(
        tPatient('statusModal.changeStatusWarningText', { status: tPatient(`filter.${PatientStatuses.Dead}`) }),
      );
      return;
    }

    setWarningText('');
  };

  useEffect(() => {
    reset({
      ...defaultValues,
      status: selectedPatientStatus,
    });
    warningTextChangeHandler();
  }, [selectedPatientStatus]);

  const availableStatusOptions = useMemo(() => {
    return availableStatuses.map((status) => ({
      label: tPatientStatuses(status),
      value: status,
    }));
  }, [availableStatuses]);

  const formLayout = useMemo(() => {
    if (!isHistory && currentPatientStatus === selectedPatientStatus) {
      return <PatientStatusDefaultFormView control={control} availableStatusOptions={availableStatusOptions} />;
    }

    switch (selectedPatientStatus) {
      case PatientStatuses.Permanent:
        return (
          <PatientStatusPermanentFormView
            control={control}
            isHistory={isHistory}
            availableStatusOptions={availableStatusOptions}
            register={register}
            gender={gender}
            kins={kins}
            setFileLoadingCount={setFileLoadingCount}
            currentPatientStatus={currentPatientStatus}
          />
        );
      case PatientStatuses.Walk_In:
        return (
          <PatientStatusWalkInFormView
            isHistory={isHistory}
            control={control}
            availableStatusOptions={availableStatusOptions}
          />
        );
      case PatientStatuses.Visiting:
        return (
          <PatientStatusVisitingFormView
            isHistory={isHistory}
            control={control}
            availableStatusOptions={availableStatusOptions}
            register={register}
            gender={gender}
            kins={kins}
            setFileLoadingCount={setFileLoadingCount}
            currentPatientStatus={currentPatientStatus}
          />
        );
      case PatientStatuses.Discharged:
        return (
          <PatientStatusDischargedFormView
            isHistory={isHistory}
            control={control}
            availableStatusOptions={availableStatusOptions}
          />
        );
      case PatientStatuses.Temporary_Transferred:
        return (
          <PatientStatusTemporaryTransferredFormView
            control={control}
            isHistory={isHistory}
            availableStatusOptions={availableStatusOptions}
          />
        );
      case PatientStatuses.Hospitalized:
        return (
          <PatientStatusHospitalizedFormView
            isHistory={isHistory}
            setValue={setValue}
            control={control}
            reason={selectedReason}
            availableStatusOptions={availableStatusOptions}
            setFileLoadingCount={setFileLoadingCount}
          />
        );
      case PatientStatuses.Dead:
        return (
          <PatientStatusDeadFormView
            isHistory={isHistory}
            control={control}
            availableStatusOptions={availableStatusOptions}
            setFileLoadingCount={setFileLoadingCount}
          />
        );
      default:
        return null;
    }
  }, [currentPatientStatus, selectedPatientStatus, availableStatusOptions, selectedReason, gender]);

  return (
    <>
      <Box
        sx={({ spacing }) => ({
          width: 1,
          flex: 1,
          overflow: 'auto',
          p: 2,
          minWidth: { xs: 'unset', sm: spacing(87) },
          maxWidth: { xs: 'unset', sm: spacing(87) },
        })}
      >
        {formLayout}
        {!!warningText && <NoticeBlock type={NoticeBlockType.Warning} text={warningText} />}
      </Box>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={({ palette, spacing }) => ({
          p: { xs: spacing(1, 2), sm: 2 },
          borderTop: `solid 1px ${palette.border.default}`,
        })}
      >
        <Button
          disabled={isSubmitting}
          onClick={onCancel}
          variant="outlined"
          size="large"
          data-testid="cancelPatientStatusFormButton"
        >
          {tCommon('button.cancel')}
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant={'contained'}
          size="large"
          disabled={
            isLoading ||
            isSubmitting ||
            fileLoadingCount > 0 ||
            (!isHistory && currentPatientStatus === selectedPatientStatus)
          }
          data-testid="submitPatientStatusFormButton"
        >
          {tCommon(`button.save`)}
          {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
        </Button>
      </Stack>
    </>
  );
};
