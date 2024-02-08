import { useEffect, useState } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { InputText } from '@components/InputText/InputText';

interface TextEditableCellProps {
  text: string;
  noteId: number;
  onBlurCallback: (value: string) => void;
  onFocusCallback: (id: number) => void;
  validators: any[];
}

export const TextEditableCell = ({
  text,
  noteId,
  onBlurCallback,
  onFocusCallback,
  validators,
}: TextEditableCellProps) => {
  const { t } = useTranslation('common');
  const [isEditMode, setIsEditMode] = useState(false);
  const [fieldValue, setFieldValue] = useState('');
  const [fieldError, setFieldError] = useState<string>('');

  const validationCheck = (validationRules: (string | boolean)[]) => {
    const isValid = validationRules.every((rule) => rule === true);
    const errorMessage = !isValid ? (validationRules.find((rule) => rule !== true) as string) : '';

    return { isValid, errorMessage };
  };

  useEffect(() => {
    setFieldValue(text);
  }, [text]);

  if (isEditMode)
    return (
      <InputText
        name="textEditable"
        variant="outlined"
        error={fieldError}
        onFocus={() => onFocusCallback(noteId)}
        onChange={(e) => setFieldValue(e.target.value)}
        onBlur={() => {
          const { isValid, errorMessage } = validationCheck(validators.map((validator) => validator(fieldValue)));
          if (isValid) {
            onBlurCallback(fieldValue);
            setIsEditMode(false);
          } else {
            setFieldError(errorMessage);
          }
        }}
        multiline
        value={fieldValue}
        sx={(theme) => ({
          ml: -2,
          width: `calc(100% + ${theme.spacing(2)})`,
          '& .MuiInputBase-root': {
            p: 2,
            backgroundColor: theme.palette.surface.default,
          },
        })}
      />
    );
  if (!isEditMode && !text) {
    return (
      <IconButton disableFocusRipple disableRipple sx={{ p: 0 }} onClick={() => setIsEditMode(true)}>
        <AddOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="labelM">{t('button.addNote')}</Typography>
      </IconButton>
    );
  }
  return (
    <Stack direction="row" spacing={4} width={1} justifyContent="space-between">
      <Typography variant="paragraphM">{text}</Typography>
      <IconButton disableRipple sx={{ p: 0 }} onClick={() => setIsEditMode(true)}>
        <EditIcon />
      </IconButton>
    </Stack>
  );
};
