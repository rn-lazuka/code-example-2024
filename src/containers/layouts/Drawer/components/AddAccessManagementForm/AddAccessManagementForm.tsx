import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@hooks/storeHooks';
import { removeDrawer, selectDrawerPayload, updateDrawer } from '@store/slices/drawerSlice';
import { useEffect, useMemo } from 'react';
import {
  clearAccessManagementSaveSuccessState,
  selectAccessManagementForm,
  selectAccessManagementSaveDataSuccess,
  selectAccessManagementSubmitting,
  submitAccessManagement,
} from '@store/slices/accessManagementSlice';
import { CVCAccessManagementForm, VascularAccessManagementForm } from '@types';
import { useForm, useFormState } from 'react-hook-form';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Dictionaries, getOptionListFromCatalog } from '@utils/getOptionsListFormCatalog';
import { FormInputRadio, FormInputText } from '@components/FormComponents';
import { validatorMinLength } from '@validators/validatorMinLength';
import { validatorMaxLength } from '@validators/validatorMaxLength';
import { validatorLatinLettersNumberCharacters } from '@validators/validatorLatinLettersNumbersCharacters';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { CvcCategoryForm } from './CvcCategoryForm';
import { VascularCategoryForm } from './VascularCategoryForm';
import { usePageUnload } from '@hooks/usePageUnload';
import { getAllowedPath } from '@utils';
import { useCallbackPrompt } from '@hooks/useCallbackPrompt';
import { addServiceModal } from '@store/slices/serviceModalSlice';
import {
  ServiceModalName,
  DrawerType,
  AccessCategory,
  AccessSide,
  CvcTimeCategory,
  Instillation,
  NeedleSize,
  NeedleType,
  VascularAccessType,
} from '@enums';
import { dateToServerFormat } from '@utils/dateFormat';

const AddAccessManagementForm = () => {
  const { t } = useTranslation('accessManagement');
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { id: patientId } = selectDrawerPayload(DrawerType.AccessManagementForm);
  const accessManagement = selectAccessManagementForm();
  const isSubmitting = selectAccessManagementSubmitting();
  const isSaveSuccess = selectAccessManagementSaveDataSuccess();

  const defaultValues: VascularAccessManagementForm & CVCAccessManagementForm = {
    accessCategory: accessManagement?.accessCategory ?? AccessCategory.VascularAccess,
    creationDate: accessManagement?.creationDate ? new Date(accessManagement.creationDate) : null,
    createdBy: accessManagement?.createdAtPlaceBy || '',
    createdAt: accessManagement?.createdAtPlace || '',
    accessType: accessManagement?.type || VascularAccessType.AVF,
    note: accessManagement?.note || '',
    side: accessManagement?.side || AccessSide.Left,
    needleType: accessManagement?.needle?.type || NeedleType.StandardAVF,
    arterialNeedleSize: accessManagement?.needle?.arterialSize || NeedleSize.Gauge17,
    venousNeedleSize: accessManagement?.needle?.venousSize || NeedleSize.Gauge17,
    comments: accessManagement?.comments || '',
    insertionDate: accessManagement?.insertionDate ? new Date(accessManagement.insertionDate) : null,
    cvcCategory: accessManagement?.category || CvcTimeCategory.Permanent,
    instillation: accessManagement?.instillation?.code || Instillation.Heparin,
    instillationExtValue: accessManagement?.instillation?.extValue?.replace(/\\n/g, '\n') || '',
    arterialVolume: accessManagement?.arterialVolume || '',
    venousVolume: accessManagement?.venousVolume || '',
  };

  const { handleSubmit, control, watch } = useForm<CVCAccessManagementForm | VascularAccessManagementForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
    shouldFocusError: true,
  });

  const accessCategory = watch('accessCategory', accessManagement?.accessCategory) ?? accessManagement?.accessCategory;
  const defaultInstillation = watch('instillation', accessManagement?.instillation?.code) ?? Instillation.Heparin;

  const { isDirty } = useFormState({ control });
  usePageUnload(isDirty, tCommon('dataLost'));
  const allowedPath = useMemo(() => getAllowedPath(patientId), [patientId]);
  const { showPrompt, cancelNavigation } = useCallbackPrompt(isDirty, allowedPath);

  const openConfirmModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: handleConfirmClose,
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };
  const handleClose = () => (isDirty ? openConfirmModal() : dispatch(removeDrawer(DrawerType.AccessManagementForm)));

  const handleConfirmClose = () => {
    dispatch(removeDrawer(DrawerType.AccessManagementForm));
    cancelNavigation();
  };
  const onSubmit = (data) => {
    let props;
    if (data?.accessCategory === AccessCategory.CVC) {
      props = {
        accessCategory: data?.accessCategory,
        cvcCategory: data?.cvcCategory,
        side: data?.side,
        instillation: {
          code: data?.instillation,
          extValue: data?.instillationExtValue?.replace(/\n/g, '\\n'),
        },
        arterialVolume: data?.arterialVolume,
        venousVolume: data?.venousVolume,
        insertionDate: (data?.insertionDate && dateToServerFormat(data.insertionDate as Date)) || null,
        comments: data?.comments.replace(/\n/g, '\\n'),
      };
    } else {
      props = {
        accessCategory: data?.accessCategory,
        type: data?.accessType,
        side: data?.side,
        needle: {
          type: data?.needleType,
          arterialSize: data?.arterialNeedleSize,
          venousSize: data?.venousNeedleSize,
        },
        creationDate: (data?.creationDate && dateToServerFormat(data.creationDate as Date)) || null,
        createdAtPlaceBy: data?.createdBy,
        createdAtPlace: data?.createdAt,
        note: data?.note,
        comments: data?.comments.replace(/\n/g, '\\n'),
      };
    }

    if (patientId) {
      dispatch(
        submitAccessManagement({
          accessManagement: props,
          patientId,
          hdAccessId: accessManagement?.id,
        }),
      );
    }
  };

  useEffect(() => {
    if (isSaveSuccess) {
      dispatch(clearAccessManagementSaveSuccessState());
      dispatch(removeDrawer(DrawerType.AccessManagementForm));
    }
  }, [isSaveSuccess]);

  useEffect(() => {
    dispatch(updateDrawer({ type: DrawerType.AccessManagementForm, statuses: { isDirty } }));
    return () => {
      dispatch(updateDrawer({ type: DrawerType.AccessManagementForm, statuses: { isDirty: false } }));
    };
  }, [isDirty]);

  useEffect(() => {
    showPrompt && openConfirmModal();
  }, [showPrompt]);

  return (
    <Stack direction="column" data-testid="addAccessManagementForm" sx={{ pb: 6.875 }} spacing={2}>
      <FormInputRadio
        control={control}
        name="accessCategory"
        label={
          <Typography
            variant="headerS"
            sx={(theme) => ({ color: theme.palette.text.secondary, textTransform: 'uppercase' })}
          >
            {t('modal.accessCategory')}
          </Typography>
        }
        options={getOptionListFromCatalog(Dictionaries.AccessCategories)}
      />
      {accessCategory === AccessCategory.CVC ? (
        <CvcCategoryForm control={control} defaultInstillation={defaultInstillation} />
      ) : (
        <VascularCategoryForm control={control} />
      )}
      <FormInputText
        control={control}
        name="comments"
        label={t('modal.comments')}
        multiline
        sx={{ pb: 7 }}
        rules={{
          minLength: validatorMinLength(2, 500),
          maxLength: validatorMaxLength(2, 500),
          pattern: validatorLatinLettersNumberCharacters(),
        }}
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
          <Button onClick={handleClose} variant={'outlined'} data-testid="cancelAddAccessManagementButton">
            {tCommon('button.cancel')}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant={'contained'}
            disabled={isSubmitting}
            data-testid="saveAddAccessManagementButton"
          >
            {tCommon('button.save')}
            {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default AddAccessManagementForm;
