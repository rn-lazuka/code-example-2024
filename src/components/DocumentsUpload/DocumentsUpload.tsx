import { Dispatch, ReactNode, Ref, SetStateAction, useRef, useState } from 'react';
import uniqid from 'uniqid';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FileUpload } from './components/FileUpload';
import type { FormFile } from '@types';
import type { FieldError } from 'react-hook-form/dist/types';

type DocumentsUploadProps = {
  maxFileSize?: number;
  maxFileCount: number;
  onChange: (files: FormFile[]) => void;
  onBlur: () => void;
  label?: string | ReactNode;
  subLabel?: string | ReactNode;
  error?: FieldError;
  name: string;
  value: FormFile[];
  setFileLoadingCount: Dispatch<SetStateAction<number>>;
  fieldRef?: Ref<HTMLLabelElement>;
  linkUrl?: string;
  multiple?: boolean;
  uploadFileUrl?: string;
  infectedFileKeys: string[];
};

const isMaxCountError = (error) => Boolean(error?.type === 'maxCount');
const isRequiredError = (error) => Boolean(error?.type === 'required');

export const DocumentsUpload = ({
  maxFileSize,
  maxFileCount,
  label,
  subLabel,
  error,
  onChange,
  onBlur,
  name,
  value,
  setFileLoadingCount,
  fieldRef,
  linkUrl,
  uploadFileUrl,
  multiple = true,
  infectedFileKeys,
}: DocumentsUploadProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('patient');
  const [formFileList, setFormFileList] = useState<FormFile[]>(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGlobalError = error && isRequiredError(error);

  const onChangeInputFile = (event) => {
    event.preventDefault();
    if (event.target.files) {
      const newFiles = [...event.target.files].map((file) => {
        file.id = uniqid();
        return file;
      });
      setFormFileList((oldList) => {
        return [...oldList, ...newFiles];
      });

      if (inputRef?.current) {
        inputRef.current.value = '';
      }
    }
  };

  const onSave = (file, temporaryFile) => {
    const formFile = {
      id: file.id,
      type: name,
      size: file.size,
      ...temporaryFile,
    };

    value.push(formFile);
    onChange(value);
    onBlur();
  };

  const deleteFileFromList = (fileId) => {
    const clearedFiles = value.filter((file) => file.id !== fileId);
    onChange(clearedFiles);
    setFormFileList((fileList) => {
      return fileList.filter((file) => file.id !== fileId);
    });
    onBlur();
  };

  const getCountError = (index) => {
    if (error && isMaxCountError(error) && maxFileCount && index > maxFileCount - 1) {
      return error.message;
    }
  };

  return (
    <Box data-testid={`${name}_FIELD`}>
      <Stack
        spacing={0.5}
        direction="column"
        sx={{
          '& .file-to-upload:last-child': {
            borderBottomRightRadius: '16px',
            borderBottomLeftRadius: '16px',
          },
        }}
      >
        <Typography variant="labelM">{label}</Typography>
        <Typography variant="paragraphS" sx={(theme) => ({ color: theme.palette.text.secondary })}>
          {subLabel}
        </Typography>
        <Paper sx={{ backgroundColor: 'rgba(0, 99, 153, 0.08)' }}>
          {formFileList.length < maxFileCount && (
            <Stack
              spacing={2}
              direction="row"
              sx={(theme) => ({
                p: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(1)}`,
                justifyContent: 'space-between',
                alignItems: 'center',
                ...(hasGlobalError ? { backgroundColor: `rgba(186, 27, 27, .08)`, borderRadius: '16px' } : {}),
              })}
            >
              <>
                <Button variant="outlined" component="label" data-testid="documentAddButton" ref={fieldRef}>
                  {tCommon('button.add')}
                  <input
                    type="file"
                    data-testid="fileInput"
                    hidden
                    multiple={multiple}
                    onChange={onChangeInputFile}
                    ref={inputRef}
                  />
                </Button>
                <Typography variant="labelS" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                  {t('modal.uploadFilesHere')}
                </Typography>
              </>
            </Stack>
          )}
          {formFileList.length > 0 &&
            formFileList.map((file, index) => (
              <FileUpload
                key={file.id}
                file={file}
                onSave={onSave}
                onDelete={deleteFileFromList}
                maxFileSize={maxFileSize}
                maxCountError={getCountError(index)}
                setFileLoadingCount={setFileLoadingCount}
                linkUrl={linkUrl}
                uploadFileUrl={uploadFileUrl}
                infectedFileKeys={infectedFileKeys}
              />
            ))}
        </Paper>
        {error && isRequiredError(error) && (
          <Typography variant="paragraphS" sx={(theme) => ({ color: theme.palette.error.main })}>
            {error.message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
