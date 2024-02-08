import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FieldError } from 'react-hook-form/dist/types';
import { SyntheticEvent, ReactNode, Ref, ReactElement } from 'react';
import { WithSx } from '@types';
import { capitalizeFirstLetter } from '@utils';
import { IconButton, InputAdornment, InputBaseComponentProps } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorIcon from '@mui/icons-material/Error';
import { convertSxToArray } from '@utils/converters/mui';
import { CustomPaper } from './components/CustomPaper';

export interface AutocompleteFreeSoloOptionType {
  value: string;
  label: string;
  group?: string;

  [key: string]: any;
}

type AutocompleteFreeSoloProps = WithSx<{
  error?: FieldError;
  label?: string;
  required?: boolean;
  onChange: (value) => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  options: AutocompleteFreeSoloOptionType[];
  value: string | { value: string; label: string };
  name: string;
  groupBy?: (option: AutocompleteFreeSoloOptionType) => string;
  capitalizedLabel?: boolean;
  changeTransformCallback?: (
    value: string | AutocompleteFreeSoloOptionType | null,
    options: AutocompleteFreeSoloOptionType[],
    event: SyntheticEvent<Element, Event>,
  ) => string | AutocompleteFreeSoloOptionType | null;
  InputProps?: {
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
  };
  inputProps?: InputBaseComponentProps;
  fieldRef?: Ref<any>;
  renderOptionCallback?: (props: any, option: any) => ReactElement;
  adornment?: string;
}>;

export const AutocompleteFreeSolo = ({
  label,
  options,
  error,
  required,
  onChange,
  onBlur,
  isDisabled,
  value,
  name,
  groupBy,
  InputProps = {},
  inputProps = {},
  changeTransformCallback,
  sx = [],
  fieldRef,
  capitalizedLabel = true,
  renderOptionCallback,
  adornment,
}: AutocompleteFreeSoloProps) => {
  const onAutocompleteChange = (
    event: SyntheticEvent<Element, Event>,
    value: string | AutocompleteFreeSoloOptionType | null,
  ) => {
    if (changeTransformCallback) {
      onChange(changeTransformCallback(value, options, event));
    } else {
      onChange(typeof value === 'string' ? { value, label: value } : value);
    }
  };

  const onAutocompleteInput = (
    event: SyntheticEvent<Element, Event>,
    value: string | AutocompleteFreeSoloOptionType | null,
  ) => {
    const option = options.find((option) => option.label === value);
    onChange(option || { label: value, value });
  };

  const getOptionLabel = (option: AutocompleteFreeSoloOptionType | string): string => {
    if (typeof option === 'string') return capitalizedLabel ? capitalizeFirstLetter(option) : option;
    const value = option.label || option.value;
    return capitalizedLabel ? capitalizeFirstLetter(`${value}`) : value;
  };

  return (
    <Autocomplete
      value={value}
      freeSolo
      options={options}
      getOptionLabel={getOptionLabel}
      onChange={onAutocompleteChange}
      onInputChange={onAutocompleteInput}
      disabled={isDisabled}
      groupBy={groupBy}
      renderOption={renderOptionCallback}
      PaperComponent={CustomPaper}
      isOptionEqualToValue={(option: AutocompleteFreeSoloOptionType, value: any) => option.value === value}
      renderInput={(params) => {
        const hasValue = typeof value === 'string' ? Boolean(value) : Boolean(value?.value);

        return (
          <TextField
            {...params}
            helperText={error ? error.message : null}
            error={!!error}
            label={label}
            variant="filled"
            required={required}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {error && (
                    <InputAdornment
                      position="end"
                      sx={{ position: 'absolute', top: '50%', right: ({ spacing }) => spacing(hasValue ? 5 : 1.5) }}
                    >
                      <ErrorIcon sx={{ color: (theme) => theme.palette.error.main, pointerEvents: 'none' }} />
                    </InputAdornment>
                  )}
                  {hasValue && !isDisabled && (
                    <InputAdornment
                      sx={{
                        position: 'absolute',
                        right: (theme) => theme.spacing(1.125),
                        top: '50%',
                      }}
                      position="end"
                    >
                      <IconButton sx={{ p: 0.5 }} onClick={() => onChange('')}>
                        <ClearIcon sx={{ fontSize: '1.25rem' }} />
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              ),
              ...(adornment
                ? {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ pointerEvents: 'none', pl: 0.5, mt: '0px !important' }}>
                        {adornment}
                      </InputAdornment>
                    ),
                  }
                : {}),
              ...InputProps,
              onBlur,
            }}
            inputProps={{ ...params.inputProps, 'data-testid': `${name}AutocompleteFreeSolo`, ...inputProps }}
            inputRef={fieldRef}
          />
        );
      }}
      sx={[
        {
          flex: 1,
          '& .MuiAutocomplete-inputRoot': {
            p: ({ spacing }) => `${spacing(2.375, 4, 0, 1.5)} !important`,
          },
          '& input': {
            p: ({ spacing }) => `${spacing(0.875, 0.5, 0.875, 0.5)} !important`,
          },
        },
        !!error && {
          '& .MuiAutocomplete-inputRoot': { backgroundColor: `rgba(186, 27, 27, .08)`, pr: 0 },
        },
        !!adornment && { '& input': { pl: 0 }, '& .MuiInputAdornment-root p': { mb: 0.5 } },
        ...convertSxToArray(sx),
      ]}
    />
  );
};
