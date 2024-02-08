import type { ServiceModalProps, ClinicalEventFormType } from '@types';
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {
  addServiceModal,
  removeServiceModal,
  submitEventForm,
  selectLoadingClinicalSchedule,
  selectServiceModal,
} from '@store/slices';
import { ServiceModalName } from '@enums/components';
import { useAppDispatch } from '@hooks/storeHooks';
import { useForm, useFormState } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { AddClinicalEventForm } from './AddClinicalEventForm';
import { DraggableComponent, FormAutocompleteOption } from '@components';

const AddClinicalEventModal = ({ index }: ServiceModalProps) => {
  const [patientsList, setPatientsList] = useState<FormAutocompleteOption[]>([]);
  const dispatch = useAppDispatch();
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('schedule');
  const isLoading = selectLoadingClinicalSchedule();
  const {
    id: editedEventId,
    patients,
    ...defaultValues
  }: ClinicalEventFormType & {
    id?: string;
    patients: { id: string; name: string; photoPath: string }[];
  } = selectServiceModal(ServiceModalName.AddClinicalEventModal);

  const { handleSubmit, control, watch, trigger, setValue, getFieldState } = useForm<ClinicalEventFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });
  const { isDirty, touchedFields } = useFormState({ control });
  const eventType = watch('type');
  const isAllDay = watch('isAllDay');
  const date = watch('date');
  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const patient = watch('patient');

  useEffect(() => {
    !!eventType && !!date && trigger('date');
    !editedEventId && setValue('doctor', null);
  }, [eventType]);

  useEffect(() => {
    if (isAllDay) {
      startTime && setValue('startTime', null);
      endTime && setValue('endTime', null);
    }
    touchedFields.startTime && trigger('startTime');
    touchedFields.endTime && trigger('endTime');
  }, [isAllDay]);

  useEffect(() => {
    startTime && trigger('endTime');
  }, [startTime]);

  useEffect(() => {
    if (patient) {
      const isPatientAlreadySelected = patientsList.find((item) => item.value === patient.value);
      !isPatientAlreadySelected &&
        setPatientsList((items) => {
          return [patient, ...items];
        });
    }
  }, [patient]);

  useEffect(() => {
    patients.length &&
      setPatientsList(patients.map(({ id, name, photoPath }) => ({ label: name, value: id, photoPath })));
  }, [patients]);

  useEffect(() => {
    setValue('patient', null);
    trigger('patient');
  }, [patientsList]);

  const onCloseHandler = () => {
    isDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeServiceModal(ServiceModalName.AddClinicalEventModal)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        )
      : dispatch(removeServiceModal(ServiceModalName.AddClinicalEventModal));
  };

  const onSubmit = (data) => {
    dispatch(submitEventForm({ ...data, id: editedEventId, patientIds: patientsList.map((patient) => patient.value) }));
  };

  return (
    <Dialog
      PaperComponent={DraggableComponent}
      open
      disableEnforceFocus
      onClose={onCloseHandler}
      data-testid="addClinicalEventModal"
      sx={{ zIndex: index, width: 1 }}
      slots={{ backdrop: () => null }}
    >
      <Stack
        direction="row"
        sx={{
          m: 0,
          p: 1,
          pl: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            flexGrow: 1,
            cursor: 'move',
          }}
          id="draggable-dialog-title"
        >
          <DragHandleIcon />
          <Typography variant="labelLSB" sx={{ ml: '34%' }}>
            {t('addEvent')}
          </Typography>
        </Stack>
        <IconButton
          onClick={onCloseHandler}
          sx={({ palette }) => ({ color: palette.icon.main })}
          data-testid="closeIcon"
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent
        dividers
        sx={({ spacing }) => ({ p: 2, display: 'flex', flexDirection: 'column', width: spacing(43) })}
      >
        <AddClinicalEventForm
          control={control}
          watch={watch}
          editedEventId={editedEventId}
          targetAudienceDefault={defaultValues.targetAudience}
          dialysisRelatedDefault={defaultValues.dialysisRelated}
          setValue={setValue}
          getFieldState={getFieldState}
          patientsList={patientsList}
          setPatientsList={setPatientsList}
        />
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'no-wrap', paddingTop: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCloseHandler}
            fullWidth
            data-testid="addClinicalEventModalCancelButton"
          >
            {tCommon('button.cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            fullWidth
            disabled={isLoading || !eventType}
            data-testid="addClinicalEventModalSaveButton"
          >
            {tCommon('button.save')}
            {isLoading && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddClinicalEventModal;
