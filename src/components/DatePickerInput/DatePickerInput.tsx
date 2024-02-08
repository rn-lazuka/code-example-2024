import type { ReactNode, Ref } from 'react';
import type { WithSx } from '@types';
import type { DateView } from '@mui/x-date-pickers';
import { useLocalizationLocale } from '@hooks/useLocalizationLocale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useCallback } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker/DatePicker';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import ErrorIcon from '@mui/icons-material/Error';
import { convertSxToArray } from '@utils/converters/mui';

type DatePickerInputProps = WithSx<{
  label: string | ReactNode;
  value: Date | null;
  onChange: (value: Date | null) => void;
  onBlur?: () => void;
  name: string;
  minDate?: Date;
  maxDate?: Date;
  isDisabled?: boolean;
  openTo?: DateView;
  error?: string | null;
  required?: boolean;
  fullWidth?: boolean;
  shouldDisableDate?: (day: Date) => boolean;
  fieldRef?: Ref<HTMLElement>;
  views?: DateView[];
  format?: string;
  helperText?: string;
}>;

export const DatePickerInput = ({
  label,
  value,
  onChange,
  onBlur,
  name,
  minDate,
  maxDate,
  isDisabled,
  error,
  required,
  fullWidth,
  shouldDisableDate,
  fieldRef,
  helperText,
  openTo,
  views,
  format = 'dd/MM/yyyy',
  sx = [],
}: DatePickerInputProps) => {
  const { adapter, locale } = useLocalizationLocale();

  const getOpenPickerIcon = useCallback(
    (props) => (
      <>
        {Boolean(error) && (
          <ErrorIcon
            sx={(theme) => ({
              position: 'absolute',
              right: theme.spacing(5),
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.palette.error.main,
              pointerEvents: 'none',
            })}
          />
        )}
        <CalendarMonth {...props} />
      </>
    ),
    [error],
  );

  const onBlurProxy = () => {
    setTimeout(() => onBlur && onBlur());
  };

  return (
    <LocalizationProvider dateAdapter={adapter} adapterLocale={locale}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        format={format}
        onClose={onBlurProxy}
        data-testid={`${name}DatePicker`}
        minDate={minDate}
        openTo={openTo}
        disabled={isDisabled}
        maxDate={maxDate}
        shouldDisableDate={shouldDisableDate}
        slots={{
          openPickerIcon: getOpenPickerIcon,
        }}
        views={views}
        slotProps={{
          textField: {
            variant: 'filled',
            onBlur: onBlurProxy,
            helperText: error || helperText || null,
            error: !!error,
            sx: [
              {
                '& .MuiInputAdornment-root .MuiIconButton-root': { mr: 0 },
                '& .MuiInputBase-input': { pr: 0 },
                label: {
                  pointerEvents: 'none',
                },
              },
              error && {
                '& .MuiInputBase-root': { backgroundColor: `rgba(186, 27, 27, .08)` },
              },
              ...convertSxToArray(sx),
            ],
            required,
            fullWidth,
            inputProps: {
              'data-testid': `${name}DatePicker`,
              placeholder: 'DD/MM/YYYY',
              ref: fieldRef,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
