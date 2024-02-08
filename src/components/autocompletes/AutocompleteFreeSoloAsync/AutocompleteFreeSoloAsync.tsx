import { ReactElement, ReactNode, SyntheticEvent, useCallback, useEffect, useRef, useState, Ref } from 'react';
import type { AxiosResponse } from 'axios';
import debounce from 'lodash/debounce';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FieldError } from 'react-hook-form/dist/types';
import Paper from '@mui/material/Paper';
import type { AutocompleteFreeSoloAsyncOptionType, WithSx } from '@types';
import { API, capitalizeFirstLetter, convertSxToArray } from '@utils';
import { IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorIcon from '@mui/icons-material/Error';
import { InputTextType } from '@enums';

const emptyOption = { label: '', value: '' };

type AutocompleteFreeSoloProps = WithSx<{
  error?: FieldError;
  label?: string;
  required?: boolean;
  onChange: (value) => void;
  textType?: InputTextType;
  onBlur?: () => void;
  isDisabled?: boolean;
  value: { value: string; label: string };
  name: string;
  groupBy?: (option: AutocompleteFreeSoloAsyncOptionType) => string;
  capitalizedLabel?: boolean;
  renderOptionCallback?: (props: any, option: any) => ReactElement;
  changeTransformCallback?: (
    value: string | AutocompleteFreeSoloAsyncOptionType | null,
    options: AutocompleteFreeSoloAsyncOptionType[],
    event: SyntheticEvent<Element, Event>,
  ) => string | AutocompleteFreeSoloAsyncOptionType | null;
  InputProps?: {
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
  };
  getOptionsUrl: string;
  optionsTransform?: (options: any) => any;
  fieldRef?: Ref<any>;
}>;

export const AutocompleteFreeSoloAsync = ({
  label,
  error,
  textType = InputTextType.Normal,
  required,
  onChange,
  isDisabled,
  getOptionsUrl,
  value,
  name,
  groupBy,
  InputProps = {},
  optionsTransform,
  renderOptionCallback,
  sx = [],
  capitalizedLabel = true,
  fieldRef,
}: AutocompleteFreeSoloProps) => {
  const [options, setOptions] = useState<AutocompleteFreeSoloAsyncOptionType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>();

  const getOptionsAsync = async (query: string): Promise<AxiosResponse<AutocompleteFreeSoloAsyncOptionType[]>> => {
    return API.get(`${getOptionsUrl}${query}`, { signal: controllerRef.current?.signal });
  };

  const setTextTransform = useCallback(() => {
    if (textType === InputTextType.Uppercase) return 'uppercase';
    if (textType === InputTextType.Capitalize) return 'capitalize';
    return 'unset';
  }, []);

  const getOptionsDelayed = useCallback(
    debounce((query: string, callback: (options: AxiosResponse<AutocompleteFreeSoloAsyncOptionType[]>) => void) => {
      setOptions([]);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      const controller = new AbortController();
      controllerRef.current = controller;
      getOptionsAsync(query).then(callback);
    }, 300),
    [],
  );

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      getOptionsDelayed(
        searchQuery.slice(0, 120),
        ({ data: options }: AxiosResponse<AutocompleteFreeSoloAsyncOptionType[]>) => {
          setOptions(optionsTransform ? optionsTransform(options) : options);
          controllerRef.current = null;
          setIsLoading(false);
        },
      );
    } else {
      setOptions([]);
    }
  }, [searchQuery, getOptionsDelayed]);

  useEffect(() => {
    setSearchQuery(value ? value.label : '');
  }, [value]);

  const onChangeHandler = (_: unknown, newValue: AutocompleteFreeSoloAsyncOptionType | null) => {
    if (value && newValue) {
      const notEqual = value.label !== newValue.label || value.value !== newValue.value;
      if (notEqual) onChange(newValue);
    } else {
      onChange(newValue);
    }
  };

  const onBlurHandler = () => {
    if ((value && value.label !== searchQuery) || !value) {
      onChange({ label: searchQuery, value: undefined });
    }
  };

  const getOptionLabel = (option: AutocompleteFreeSoloAsyncOptionType | string): string => {
    if (typeof option === 'string') return capitalizedLabel ? capitalizeFirstLetter(option) : option;
    const value = String(option.label || option.value || '');
    return capitalizedLabel ? capitalizeFirstLetter(value) : value;
  };

  return (
    <Autocomplete
      value={value}
      freeSolo
      options={options}
      getOptionLabel={getOptionLabel}
      onBlur={onBlurHandler}
      onChange={onChangeHandler as any}
      disabled={isDisabled}
      groupBy={groupBy}
      loading={isLoading}
      PaperComponent={CustomPaper}
      isOptionEqualToValue={(option: AutocompleteFreeSoloAsyncOptionType, value: any) => option.value === value}
      renderOption={renderOptionCallback}
      renderInput={(params) => {
        const hasValue = Boolean(value) && (Boolean(value?.value) || Boolean(value?.label));
        return (
          <TextField
            {...params}
            helperText={error ? error.message : null}
            error={!!error}
            label={label}
            variant="filled"
            required={required}
            onInput={(event) => setSearchQuery((event.target as HTMLInputElement).value)}
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
                      <IconButton
                        sx={{ p: 0.5 }}
                        onClick={() => {
                          onChange(emptyOption);
                        }}
                      >
                        <ClearIcon sx={{ fontSize: '1.25rem' }} />
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              ),
              ...InputProps,
            }}
            inputProps={{ ...params.inputProps, value: searchQuery, 'data-testid': `${name}AutocompleteFreeSoloAsync` }}
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
            textTransform: setTextTransform(),
            p: ({ spacing }) => `${spacing(0.875, 0.5, 0.875, 0.5)} !important`,
          },
        },
        !!error && {
          '& .MuiAutocomplete-inputRoot': { backgroundColor: `rgba(186, 27, 27, .08)`, pr: 0 },
        },
        ...convertSxToArray(sx),
      ]}
    />
  );
};

const CustomPaper = (props) => {
  return (
    <Paper
      elevation={1}
      sx={(theme) => ({
        borderRadius: 0,
        borderBottomLeftRadius: theme.spacing(1),
        borderBottomRightRadius: theme.spacing(1),
      })}
      {...props}
    />
  );
};
