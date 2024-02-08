import { useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useForm, useFormState } from 'react-hook-form';
import { useAppDispatch, useDoctor, useGetAllergyNoticeInfo, useIgnoreFirstRenderEffect, usePageUnload } from '@hooks';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { removeDrawer, selectDrawerPayload, updateDrawer } from '@store/slices/drawerSlice';
import Box from '@mui/material/Box';
import { addServiceModal } from '@store/slices/serviceModalSlice';
import {
  DoctorTypes,
  DrawerType,
  NoticeBlockType,
  ServiceModalName,
  VaccinationDrawerType,
  VaccinationStatus,
  VaccinationType,
  FileTypes,
} from '@enums';
import { useConfirmNavigation } from '@hooks/useConfirmNavigation';
import {
  addVaccination,
  checkHasTodayEncounter,
  clearVaccinationSaveSuccess,
  editVaccination,
  selectVaccinationForm,
  selectVaccinationSaveDataSuccess,
  selectVaccinationSubmitting,
} from '@store/slices';
import { NoticeBlock } from '@components/NoticeBlock/NoticeBlock';
import {
  FormFile,
  VaccinationAlreadyAdministeredRequest,
  VaccinationForm,
  VaccinationToAdministerRequest,
} from '@types';
import { AddVaccinationFormView } from './AddVaccinationFormView';
import { dateToServerFormat, capitalize } from '@utils';
import { defaultVaccineAmount, defaultVaccineCode } from '@constants';
import { getCodeValueFromCatalog } from '@utils/getOptionsListFormCatalog';
import RichTableCellVaccinationStatus from '@components/RichTable/components/components/RichTableCellVaccinationStatus';

const AddVaccinationForm = () => {
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { id: patientId, type, status } = selectDrawerPayload(DrawerType.VaccinationForm);
  const isSubmitting = selectVaccinationSubmitting();
  const isSaveSuccess = selectVaccinationSaveDataSuccess();
  const formData = selectVaccinationForm();
  const { noticeInfo } = useGetAllergyNoticeInfo(patientId);
  const [fileLoadingCount, setFileLoadingCount] = useState<number>(0);

  const setAdministerDate = () => {
    if (
      formData?.administerDate &&
      (status === VaccinationStatus.Pending || status === VaccinationStatus.NotDone || !status)
    ) {
      return new Date();
    }
    if (formData?.administerDate && status === VaccinationStatus.AdministeredExternal) {
      return formData?.administerDate;
    }
    return undefined;
  };

  const defaultValues: VaccinationForm = {
    type:
      status === VaccinationStatus.Pending || status === VaccinationStatus.NotDone || !status
        ? VaccinationType.ToAdminister
        : VaccinationType.Administered,
    vaccineType: formData?.vaccineType?.code
      ? {
          label: getCodeValueFromCatalog('vaccines', formData?.vaccineType.code),
          value: formData?.vaccineType.code,
        }
      : { label: getCodeValueFromCatalog('vaccines', defaultVaccineCode), value: defaultVaccineCode },
    amount: formData?.amount || defaultVaccineAmount,
    administeredVaccineType: formData?.administeredVaccineType || '',
    dossingSchedule: formData?.dossingSchedule || '',
    administerDate: setAdministerDate(),
    prescribedBy: formData?.prescribedBy,
    doctorsSpecialitySelect: formData?.doctorsSpecialitySelect,
    doctorsSpecialityText: formData?.doctorsSpecialityText,
    prescriptionDate: formData?.prescriptionDate ? new Date(formData.prescriptionDate) : new Date(),
    comments: formData?.comments || '',
    clinic: formData?.clinic
      ? {
          value: formData?.clinic?.value,
          label: formData?.clinic?.label,
        }
      : undefined,
    files: formData?.files || [],
  };

  const { handleSubmit, control, watch, trigger } = useForm<VaccinationForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });

  const prescribedByName = watch('prescribedBy')?.label;
  const selectedType = watch('type');
  const doctorsSpecialitySelect = watch('doctorsSpecialitySelect');
  const administerDate = watch('administerDate');

  const selectedDoctor = useMemo(() => {
    return { name: prescribedByName, internalDoctorId: doctorsSpecialitySelect, source: DoctorTypes.Internal };
  }, [prescribedByName, doctorsSpecialitySelect]);
  const { isExternalDoctor, specialities } = useDoctor(formData, watch('prescribedBy'), selectedDoctor);

  useConfirmNavigation(isDirty, ['/patients-overview']);
  usePageUnload(isDirty, tCommon('dataLost'));

  const handleClose = () => {
    isDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeDrawer(DrawerType.VaccinationForm)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        )
      : dispatch(removeDrawer(DrawerType.VaccinationForm));
  };

  const onSubmit = ({ prescribedBy, vaccineType, clinic, administeredVaccineType, ...data }: VaccinationForm) => {
    const preparedFiles = data?.files?.map((file) => {
      if (file.tempKey) {
        return {
          name: file.name,
          type: FileTypes.Vaccination,
          tempKey: file.tempKey,
        } as FormFile;
      }
      return file;
    });
    if (patientId) {
      const vaccinationData: VaccinationToAdministerRequest | VaccinationAlreadyAdministeredRequest = {
        type: data.type,
        vaccineType:
          data.type === VaccinationType.ToAdminister && vaccineType
            ? {
                name: vaccineType.label,
                code: vaccineType.value,
              }
            : { name: administeredVaccineType! },
        amount: data.type === VaccinationType.ToAdminister ? data?.amount : 2,
        dossingSchedule: data.dossingSchedule,
        administerDate: dateToServerFormat(data.administerDate as Date),
        prescribedBy:
          data.type === VaccinationType.ToAdminister && prescribedBy
            ? {
                source: isExternalDoctor ? DoctorTypes.External : DoctorTypes.Internal,
                internalDoctorId: !isExternalDoctor ? data.doctorsSpecialitySelect : undefined,
                name: isExternalDoctor ? capitalize(prescribedBy.label) : undefined,
                speciality: isExternalDoctor ? capitalize(data.doctorsSpecialityText as string) : undefined,
              }
            : undefined,
        prescriptionDate:
          (!status || status === VaccinationStatus.Pending || status === VaccinationStatus.NotDone) &&
          data.type === VaccinationType.ToAdminister
            ? dateToServerFormat(data.prescriptionDate as Date)
            : undefined,
        comments: data?.comments,
        clinic:
          clinic && data.type === VaccinationType.Administered
            ? { branchId: clinic?.value ? +clinic.value : undefined, name: clinic?.label }
            : undefined,
        files: data.type === VaccinationType.Administered ? preparedFiles : undefined,
      };
      if (formData && type === VaccinationDrawerType.Edit) {
        dispatch(
          editVaccination({
            vaccination: vaccinationData,
            vaccinationId: formData.id,
            id: patientId,
          }),
        );
      } else {
        dispatch(addVaccination({ vaccination: vaccinationData, id: patientId }));
      }
    }
  };

  useEffect(() => {
    dispatch(checkHasTodayEncounter(patientId));
  }, []);

  useIgnoreFirstRenderEffect(() => {
    if (administerDate) {
      trigger('administerDate');
    }
  }, [selectedType]);

  useEffect(() => {
    if (isSaveSuccess) {
      dispatch(clearVaccinationSaveSuccess());
      dispatch(removeDrawer(DrawerType.VaccinationForm));
    }
  }, [isSaveSuccess]);

  useEffect(() => {
    dispatch(updateDrawer({ type: DrawerType.VaccinationForm, statuses: { isDirty: isDirty } }));
    return () => {
      dispatch(updateDrawer({ type: DrawerType.VaccinationForm, statuses: { isDirty: false } }));
    };
  }, [isDirty]);

  return (
    <>
      <Stack direction="column" data-testid="addVaccinationForm" sx={{ pb: 6.875 }}>
        {formData?.status && (
          <RichTableCellVaccinationStatus status={formData.status} dotsTextOverflow={false} sx={{ mb: 2 }} />
        )}
        <NoticeBlock
          type={noticeInfo.type}
          title={noticeInfo.title}
          text={noticeInfo.text}
          sx={[noticeInfo.type === NoticeBlockType.Error && { alignItems: 'flex-start' }, { mb: 2 }]}
        />
        <AddVaccinationFormView
          control={control}
          watch={watch}
          trigger={trigger}
          setFileLoadingCount={setFileLoadingCount}
          specialities={specialities as []}
          isExternalDoctor={isExternalDoctor}
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
            <Button onClick={handleClose} variant={'outlined'} data-testid="cancelVaccinationButton">
              {tCommon('button.cancel')}
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant={'contained'}
              disabled={isSubmitting || fileLoadingCount > 0}
              data-testid="saveVaccinationButton"
            >
              {tCommon('button.save')}
              {isSubmitting ||
                (fileLoadingCount > 0 && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />)}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default AddVaccinationForm;
