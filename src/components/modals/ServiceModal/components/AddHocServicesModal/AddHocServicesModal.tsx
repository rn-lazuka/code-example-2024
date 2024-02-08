import type { AddHocEventFormType, ServiceModalProps } from '@types';
import { useTranslation } from 'react-i18next';
import { useForm, useFormState } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import { DraggableComponent } from '@components/DraggableComponent/DraggableComponent';
import {
  addServiceModal,
  removeServiceModal,
  saveAddHocEvent,
  selectScheduleLoading,
  selectServiceModal,
  selectUserPermissions,
} from '@store/slices';
import { LabSpecimenType, ServiceModalName, UserPermissions, AddHocEventTypes, AddServiceModalPlace } from '@enums';
import { useAppDispatch } from '@hooks';
import CircularProgress from '@mui/material/CircularProgress';
import { FormInputRadio } from '@components/FormComponents';
import { useEffect } from 'react';
import { Dictionaries, getOptionListFromCatalog } from '@utils/getOptionsListFormCatalog';
import { AddHocLabTestServiceForm } from './AddHocLabTestServiceForm';
import { AddHocHdServiceForm } from './AddHocHdServiceForm';
import { getTenantDate } from '@utils';
import Box from '@mui/material/Box';

const AddHocServicesModal = ({ index }: ServiceModalProps) => {
  const dispatch = useAppDispatch();
  const userPermissions = selectUserPermissions();
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('schedule');
  const {
    place,
    isolationGroupId,
    ...defaultValues
  }: { place: AddServiceModalPlace; isolationGroupId: string } & AddHocEventFormType = selectServiceModal(
    ServiceModalName.AddHocServicesModal,
  );
  const loading = selectScheduleLoading();

  const { trigger, control, handleSubmit, watch, setValue } = useForm<AddHocEventFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });
  const type = watch('type');
  const { isDirty } = useFormState({ control });

  useEffect(() => {
    if (type === AddHocEventTypes.LAB_TEST) {
      setValue('date', getTenantDate());
      setValue('specimenType', LabSpecimenType.BLOOD);
    }
  }, [type]);

  const typeOptions = getOptionListFromCatalog(Dictionaries.AddHocEventTypes).map((option) => {
    if (option.value === AddHocEventTypes.LAB_TEST) {
      return {
        ...option,
        disabled:
          place === AddServiceModalPlace.SHIFT || !userPermissions.includes(UserPermissions.AnalysesModifyOrder),
      };
    }
    return option;
  });

  const getFormView = () => {
    switch (type) {
      case AddHocEventTypes.HD:
        return (
          <AddHocHdServiceForm
            isolationGroupId={isolationGroupId}
            control={control}
            watch={watch}
            setValue={setValue}
            place={place}
            trigger={trigger}
          />
        );
      case AddHocEventTypes.LAB_TEST:
        return <AddHocLabTestServiceForm control={control} setValue={setValue} watch={watch} />;
      default:
        return null;
    }
  };
  const onSubmit = (data: AddHocEventFormType) => {
    dispatch(saveAddHocEvent(data));
  };

  const onCloseHandler = () => {
    isDirty
      ? dispatch(
          addServiceModal({
            name: ServiceModalName.ConfirmModal,
            payload: {
              closeCallback: () => dispatch(removeServiceModal(ServiceModalName.AddHocServicesModal)),
              title: tCommon('closeWithoutSaving'),
              text: tCommon('dataLost'),
              confirmButton: tCommon('button.continue'),
              cancelButton: tCommon('button.cancel'),
            },
          }),
        )
      : dispatch(removeServiceModal(ServiceModalName.AddHocServicesModal));
  };

  return (
    <Dialog
      PaperComponent={DraggableComponent}
      open
      disableEnforceFocus
      onClose={onCloseHandler}
      data-testid="addHocServicesModal"
      sx={{ zIndex: index, width: 1 }}
      slots={{ backdrop: () => null }}
    >
      <Box display="flex">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            m: 0,
            py: 1,
            pl: 2,
            pr: 10,
            cursor: 'move',
            width: 'calc(100% - 40px)',
          }}
          id="draggable-dialog-title"
        >
          <DragHandleIcon />
          <Typography variant="labelLSB">{t('addHocEventForm.addService')}</Typography>
        </Stack>
        <IconButton
          onClick={onCloseHandler}
          sx={({ palette }) => ({ color: palette.icon.main, mr: 1 })}
          data-testid="closeIcon"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent
        dividers
        sx={({ spacing }) => ({ p: 2, display: 'flex', flexDirection: 'column', width: spacing(43) })}
      >
        <Stack direction="column" spacing={2}>
          <FormInputRadio control={control} name="type" options={typeOptions} />
          {getFormView()}
        </Stack>
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'no-wrap', paddingTop: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCloseHandler}
            fullWidth
            data-testid="addHocServicesModalCancelButton"
          >
            {tCommon('button.cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            fullWidth
            disabled={loading}
            data-testid="addHocServicesModalSaveButton"
          >
            {tCommon('button.save')}
            {loading && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddHocServicesModal;
