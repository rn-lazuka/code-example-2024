import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFormState } from 'react-hook-form';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { FileDocument, ServiceModalProps } from '@types';
import { FormDocumentsUpload, InfoModal } from '@components';
import { useAppDispatch } from '@hooks/storeHooks';
import {
  addSnack,
  addServiceModal,
  removeServiceModal,
  selectLabOrdersIsSubmitting,
  selectServiceModal,
  submitLabResultFile,
  selectLabOrdersS3AntivirusErrors,
} from '@store/slices';
import { FileTypes, ServiceModalName, SnackType } from '@enums';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_TEXT } from '@constants';
import { validatorMaxFileCount, validatorMaxFileSize, validatorInfectedFiles } from '@validators';
import { API } from '@utils';

type LabResulFileAttachForm = {
  file: FileDocument[];
};

const LabResultAttachFileModal = ({ index }: ServiceModalProps) => {
  const { t } = useTranslation('labOrders');
  const { t: tCommon } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { labOrderId } = selectServiceModal(ServiceModalName.AttachFileModal);
  const isSubmitting = selectLabOrdersIsSubmitting();
  const infectedFileKeys = selectLabOrdersS3AntivirusErrors();
  const [fileLoadingCount, setFileLoadingCount] = useState(0);

  const defaultValues: LabResulFileAttachForm = {
    file: [],
  };
  const [loading, setLoading] = useState(true);
  const [alreadyAttachedFile, setAlreadyAttachedFile] = useState<FileDocument[]>([]);

  const { setValue, control, handleSubmit, watch } = useForm<LabResulFileAttachForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    shouldUnregister: true,
  });

  const { isDirty } = useFormState({ control });
  const fileInputValue = watch('file');

  const openCancellationModal = () => {
    dispatch(
      addServiceModal({
        name: ServiceModalName.ConfirmModal,
        payload: {
          closeCallback: () => {
            dispatch(removeServiceModal(ServiceModalName.AttachFileModal));
          },
          title: tCommon('closeWithoutSaving'),
          text: tCommon('dataLost'),
          confirmButton: tCommon('button.continue'),
        },
      }),
    );
  };

  const onCloseHandler = () => {
    isDirty ? openCancellationModal() : dispatch(removeServiceModal(ServiceModalName.AttachFileModal));
  };

  const onSubmit = (data: LabResulFileAttachForm) => {
    dispatch(
      submitLabResultFile({
        labOrderId,
        file: data.file.map((file) => {
          if (file.tempKey) {
            return {
              name: file.name,
              type: FileTypes.LabOrderResult,
              tempKey: file.tempKey,
              size: file.size,
            } as FileDocument;
          }
          return file;
        })[0],
      }),
    );
  };

  useEffect(() => {
    API.get(`/pm/lab-results/${labOrderId}`)
      .then(({ data }) => {
        if (data.file) {
          setValue('file', [data.file]);
          setAlreadyAttachedFile([data.file]);
        }
      })
      .catch(() => dispatch(addSnack({ type: SnackType.Error, message: tCommon('systemError') })))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (fileInputValue && fileInputValue.length && fileInputValue[0].id !== alreadyAttachedFile[0]?.id) {
      setAlreadyAttachedFile([]);
    }
  }, [fileInputValue]);

  return (
    <InfoModal isOpen={true} title={t('modals.attachFile')} onClose={onCloseHandler} sx={{ zIndex: index }}>
      <Stack
        spacing={3}
        sx={({ spacing }) => ({
          p: spacing(2),
        })}
      >
        {loading ? (
          <Stack direction="row" justifyContent="center" p={3}>
            <CircularProgress />
          </Stack>
        ) : (
          <FormDocumentsUpload
            name="file"
            control={control}
            multiple={false}
            maxFileSize={MAX_FILE_SIZE}
            subLabel={tCommon('fileUpload.fileLimits', { maxFileCount: 1, maxFileSize: MAX_FILE_SIZE_TEXT })}
            maxFileCount={1}
            rules={{
              validate: {
                maxCount: validatorMaxFileCount(1),
                maxSize: validatorMaxFileSize(MAX_FILE_SIZE),
                infected: validatorInfectedFiles(infectedFileKeys),
              },
            }}
            setFileLoadingCount={setFileLoadingCount}
            linkUrl={alreadyAttachedFile.length ? `/pm/lab-results/${labOrderId}/printing` : undefined}
            infectedFileKeys={infectedFileKeys}
          />
        )}
        <Stack direction="row" spacing={2}>
          <Button
            disabled={isSubmitting}
            onClick={onCloseHandler}
            variant="outlined"
            data-testid="LabResultAttachFileModalCancelButton"
            sx={{ flexGrow: 1 }}
          >
            {tCommon('button.cancel')}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant={'contained'}
            disabled={isSubmitting || fileLoadingCount > 0}
            data-testid="LabResultAttachFileModalSubmitButton"
            sx={{ flexGrow: 1 }}
          >
            {tCommon(`button.save`)}
            {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
          </Button>
        </Stack>
      </Stack>
    </InfoModal>
  );
};

export default LabResultAttachFileModal;
