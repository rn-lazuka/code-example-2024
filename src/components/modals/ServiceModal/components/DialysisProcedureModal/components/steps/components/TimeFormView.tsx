import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Box from '@mui/material/Box';
import { selectDialysisIsSubmitting, selectDialysisStartTime } from '@store';
import { FormTimePicker } from '@components/FormComponents/FormTimePicker';
import { validatorFutureTime, validatorRequired, validatorTimeNotEarlierThanNotEqual } from '@validators';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import { Control, FieldValues, Path, PathValue, ValidateResult } from 'react-hook-form';
import { getTenantDate } from '@utils/getTenantDate';

export enum TimeFormType {
  START,
  FINISH,
}

type TimeFormViewProps<T extends FieldValues = FieldValues> = {
  open: boolean;
  onClose: () => void;
  type: TimeFormType;
  control: Control<T, any>;
  onSubmit: () => void;
};

export const TimeFormView = <T extends FieldValues>({
  control,
  open,
  onClose,
  type,
  onSubmit,
}: TimeFormViewProps<T>) => {
  const isSubmitting = selectDialysisIsSubmitting();
  const { t } = useTranslation('dialysis');
  const { t: tCommon } = useTranslation('common');
  const startTime = selectDialysisStartTime();
  const name = type === TimeFormType.START ? ('startedAt' as Path<T>) : ('endsAt' as Path<T>);
  const timeFieldValidation: {
    maxDate: (value: PathValue<T, Path<T>>) => ValidateResult | Promise<ValidateResult>;
    notEarlierThan?: (value: PathValue<T, Path<T>>) => ValidateResult | Promise<ValidateResult>;
  } = { maxDate: validatorFutureTime() };

  if (type === TimeFormType.FINISH && startTime) {
    timeFieldValidation.notEarlierThan = validatorTimeNotEarlierThanNotEqual(new Date(startTime));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      data-testid={`${type === TimeFormType.START ? 'start' : 'finish'}HdModal`}
      sx={{ '& .MuiDialog-paper': { mx: 2 } }}
    >
      <Box sx={({ spacing }) => ({ m: 0, p: 2, width: spacing(42.5), maxWidth: spacing(87) })}>
        <Typography variant="headerS" data-testid={`${type === TimeFormType.START ? 'start' : 'finish'}HdHeader`}>
          {t(`buttons.${type === TimeFormType.START ? 'startHd' : 'finishHd'}`)}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.icon.main,
          }}
          data-testid="closeIcon"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <>
          <Stack spacing={2} direction="column" sx={{ width: 1, p: 2 }}>
            <FormTimePicker
              control={control}
              name={name}
              label={t(`form.${type === TimeFormType.START ? 'startTime' : 'endTime'}`)}
              maxTime={getTenantDate()}
              minTime={type === TimeFormType.START ? undefined : new Date(startTime)}
              required
              rules={{
                required: validatorRequired(),
                validate: timeFieldValidation,
              }}
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ flexWrap: 'no-wrap', p: 2 }}>
            <Button onClick={onClose} variant="outlined" data-testid="cancelTimeFormModalButton" sx={{ flex: 1 }}>
              {tCommon('button.cancel')}
            </Button>
            <Button
              onClick={onSubmit}
              variant="contained"
              disabled={isSubmitting}
              data-testid={`save${type === TimeFormType.START ? 'Start' : 'Finish'}DialysisTimeButton`}
            >
              {t(`buttons.${type === TimeFormType.START ? 'startHd' : 'finishHd'}`)}
              {type === TimeFormType.START ? (
                <SmartDisplayOutlinedIcon sx={(theme) => ({ color: theme.palette.primary[100], ml: 1.5 })} />
              ) : (
                <TaskAltIcon sx={(theme) => ({ color: theme.palette.primary[100], ml: 1.5 })} />
              )}
              {isSubmitting && <CircularProgress size="20px" color="inherit" sx={{ ml: 1 }} />}
            </Button>
          </Stack>
        </>
      </DialogContent>
    </Dialog>
  );
};
