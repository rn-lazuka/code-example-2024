import { ClinicalNoteForm } from '@types';
import { useForm, useFormState } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { AddClinicalNoteFormView } from '@containers/layouts/Drawer/components/AddClinicalNoteForm/AddClinicalNoteFormView';
import { useEffect } from 'react';
import {
  addServiceModal,
  selectSelectedClinicalNoteType,
  selectClinicalNoteSubmitting,
  removeDrawer,
  selectDrawerPayload,
  updateDrawer,
  selectClinicalNoteForm,
  resetClinicalNoteFormData,
  addOrEditClinicalNote,
} from '@store';
import { usePageUnload, useConfirmNavigation, useAppDispatch } from '@hooks';
import { ServiceModalName, DrawerType } from '@enums';

const AddClinicalNoteForm = () => {
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { id: patientId, place } = selectDrawerPayload(DrawerType.ClinicalNotesForm);
  const isSubmitting = selectClinicalNoteSubmitting();
  const selectedClinicalNoteType = selectSelectedClinicalNoteType();
  const formData = selectClinicalNoteForm();

  const defaultValues: ClinicalNoteForm = {
    type: formData ? formData.type : selectedClinicalNoteType,
    note: formData ? formData.note : '',
  };

  const { handleSubmit, control } = useForm<ClinicalNoteForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldFocusError: true,
  });
  const { isDirty } = useFormState({ control });

  useConfirmNavigation(isDirty, ['/patients-overview']);
  usePageUnload(isDirty, tCommon('dataLost'));

  useEffect(() => {
    return () => {
      dispatch(resetClinicalNoteFormData());
    };
  }, []);

  useEffect(() => {
    dispatch(updateDrawer({ type: DrawerType.ClinicalNotesForm, statuses: { isDirty } }));
    return () => {
      dispatch(updateDrawer({ type: DrawerType.ClinicalNotesForm, statuses: { isDirty: false } }));
    };
  }, [isDirty]);

  const handleClose = () => {
    isDirty ? openCancellationModal() : dispatch(removeDrawer(DrawerType.ClinicalNotesForm));
  };

  const openCancellationModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => dispatch(removeDrawer(DrawerType.ClinicalNotesForm)),
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };

  const onSubmit = (data) => {
    if (patientId) {
      dispatch(addOrEditClinicalNote({ isAdding: !formData, clinicalNote: data, patientId: +patientId, place }));
    }
  };

  return (
    <>
      <Stack direction="column" pb={6.875}>
        <AddClinicalNoteFormView control={control} />
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
            <Button onClick={handleClose} variant={'outlined'} data-testid="cancelClinicalNoteButton">
              {tCommon('button.cancel')}
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant={'contained'}
              disabled={isSubmitting}
              data-testid="saveClinicalNoteButton"
            >
              {tCommon('button.save')}
              {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default AddClinicalNoteForm;
