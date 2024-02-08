import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { API, handleFileLinkClick } from '@utils';
import type { AxiosResponse } from 'axios';
import Stack from '@mui/material/Stack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { formatFileSize } from '@utils/formatFileSize';
import { useSnack } from '@hooks';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import { FileWithId, FormFile, TemporaryFileResponse } from '@types';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { SnackType } from '@enums';

type FileUploadProps = {
  file: FileWithId | FormFile;
  onSave: (file: FileWithId, uploadedFile: TemporaryFileResponse) => void;
  onDelete: (fileId: string | number) => void;
  maxFileSize?: number;
  maxCountError?: string;
  setFileLoadingCount: Dispatch<SetStateAction<number>>;
  linkUrl?: string;
  uploadFileUrl?: string;
  infectedFileKeys: string[];
};

function isNewUploadedFile(file: FileWithId | FormFile): file is FileWithId {
  return (file as FileWithId).lastModified !== undefined;
}

const getErrorMessage = (error) => {
  switch (true) {
    case error.name === 'CanceledError':
      return 'modal.uploadCancel';
    case error.response?.status === 408:
      return 'modal.uploadTimeError';
    default:
      return 'modal.uploadError';
  }
};

export const FileUpload = ({
  file,
  onDelete,
  onSave,
  maxFileSize,
  maxCountError,
  setFileLoadingCount,
  linkUrl,
  uploadFileUrl = '/pm/patients/files',
  infectedFileKeys,
}: FileUploadProps) => {
  const { t } = useTranslation('patient');
  const { t: tCommon } = useTranslation('common');
  const [progressTotalPercent, setProgressTotalPercent] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(0);
  const [uploadFile, setUploadFile] = useState<TemporaryFileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { displaySnack } = useSnack();

  useEffect(() => {
    if (
      uploadFile?.tempKey &&
      infectedFileKeys.length &&
      infectedFileKeys.find((infectedFileKey) => infectedFileKey.includes(uploadFile.tempKey))
    ) {
      setError(tCommon('fileUpload.fileWasInfected'));
    }
  }, [infectedFileKeys]);

  const controller = useRef(new AbortController());
  const isNewFile = isNewUploadedFile(file);

  useEffect(() => {
    setError(maxCountError);
  }, [maxCountError]);

  useEffect(() => {
    if (maxFileSize && file.size > maxFileSize) {
      setUploadFile({ name: '', tempKey: '' });
      setError(tCommon('validation.maxFileSize'));
      return;
    }

    if (isNewFile) {
      let formData = new FormData();
      formData.append('file', file);

      setIsLoading(true);
      setFileLoadingCount((value) => ++value);
      API.post(uploadFileUrl, formData, {
        signal: controller.current.signal,
        headers: {
          'content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progress) => {
          setProgressTotalPercent((progress.loaded / progress.total) * 100);
          setProgressTotal(progress.total);
          setProgressLoaded(progress.loaded);
        },
      })
        .then(({ data }: AxiosResponse<TemporaryFileResponse>) => {
          setUploadFile(data);
          setIsLoading(false);
          setFileLoadingCount((value) => --value);
        })
        .catch((error) => {
          const errorMessage = getErrorMessage(error);
          setError(t(errorMessage));
          displaySnack({ type: SnackType.Error, message: t(errorMessage), timeout: 5000 });
          setProgressTotalPercent(0);
          setProgressLoaded(0);
          setIsLoading(false);
          setFileLoadingCount((value) => --value);
        });
    }
  }, [file]);

  useEffect(() => {
    if (uploadFile && isNewFile) {
      onSave(file, uploadFile);
    }
  }, [uploadFile]);

  const cancelUploadOrDelete = () => {
    if (isLoading) {
      controller.current.abort();
    } else {
      onDelete(file.id);
    }
  };

  const getProgressBlock = () => {
    switch (true) {
      case Boolean(error):
        return (
          <Typography
            variant="paragraphS"
            data-testid="fileError"
            sx={(theme) => ({ color: theme.palette.error.main })}
          >
            {error}
          </Typography>
        );
      case Boolean(!isNewFile):
      case Boolean(uploadFile):
        return (
          <Typography
            variant="paragraphS"
            data-testid="fileSize"
            sx={(theme) => ({ color: theme.palette.text.secondary })}
          >
            {formatFileSize(file.size)}
          </Typography>
        );
      default:
        return (
          <Stack direction="row" spacing={3} sx={{ width: '100%', alignItems: 'center' }}>
            <LinearProgress sx={{ width: '50%' }} variant="determinate" value={progressTotalPercent} />
            <Typography
              variant="paragraphS"
              sx={(theme) => ({ color: theme.palette.text.secondary })}
            >{`${formatFileSize(progressLoaded)} / ${formatFileSize(progressTotal)}`}</Typography>
          </Stack>
        );
    }
  };

  const handleLinkClick = async () => {
    await handleFileLinkClick(linkUrl as string, file);
  };

  return (
    <Stack
      spacing={1}
      direction="row"
      className="file-to-upload"
      sx={(theme) => ({
        p: `${theme.spacing(1.25)} ${theme.spacing(1.5)} ${theme.spacing(1.25)} ${theme.spacing(1.5)}`,
        borderTop: `1px solid ${theme.palette.primary[100]}`,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...(error ? { backgroundColor: `rgba(186, 27, 27, .08)` } : {}),
      })}
    >
      <Stack
        spacing={0.5}
        direction="row"
        sx={{
          alignItems: 'center',
          width: '100%',
        }}
      >
        <AttachFileIcon />
        <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
          <Typography
            onClick={linkUrl ? handleLinkClick : undefined}
            variant="paragraphM"
            sx={(theme) =>
              linkUrl
                ? {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                    color: theme.palette.primary.main,
                  }
                : { color: theme.palette.text.darker, wordBreak: 'break-all' }
            }
          >
            {file.name}
          </Typography>
          {getProgressBlock()}
        </Stack>
      </Stack>
      {error && <ErrorIcon sx={(theme) => ({ color: theme.palette.error.main })} />}
      <IconButton onClick={cancelUploadOrDelete} data-testid="deleteButton">
        {isLoading ? <CloseIcon /> : <DeleteOutlineIcon />}
      </IconButton>
    </Stack>
  );
};
