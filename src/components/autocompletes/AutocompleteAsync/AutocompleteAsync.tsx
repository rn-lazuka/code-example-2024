import { Ref, useCallback, useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { API, capitalizeFirstLetter } from '@utils';
import type { AxiosResponse } from 'axios';
import debounce from 'lodash/debounce';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { FieldError } from 'react-hook-form/dist/types';
import { WithSx } from '@types';
import ErrorIcon from '@mui/icons-material/Error';
import { convertSxToArray } from '@utils/converters/mui';
import isEqual from 'lodash/isEqual';
import { IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export interface AutocompleteAsyncOptionType {
  id: string;
  label: string;
}

type AutocompleteAsyncProps = WithSx<{
  error?: FieldError;
  label?: string;
  required?: boolean;
  onChange: (value) => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  getOptionsUrl: string;
  value?: AutocompleteAsyncOptionType | null;
  capitalizedLabel?: boolean;
  fullWidth?: boolean;
  name: string;
  optionsTransform?: (options: any) => AutocompleteAsyncOptionType[];
  onOptionsUpdated?: (options: any) => any;
  fieldRef?: Ref<HTMLElement>;
}>;

export const AutocompleteAsync = ({
  error,
  label,
  required,
  onChange,
  isDisabled,
  getOptionsUrl,
  onBlur,
  value,
  capitalizedLabel = true,
  fullWidth = true,
  sx = [],
  name,
  optionsTransform,
  onOptionsUpdated,
  fieldRef,
}: AutocompleteAsyncProps) => {
  const [options, setOptions] = useState<AutocompleteAsyncOptionType[]>([]);
  const [localValue, setLocalValue] = useState<AutocompleteAsyncOptionType | null | undefined>(value);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>();

  const getOptionsAsync = async (query: string): Promise<AxiosResponse<AutocompleteAsyncOptionType[]>> => {
    return API.get(`${getOptionsUrl}${query}`, { signal: controllerRef.current?.signal });
  };

  const renderOptionCallback = useCallback((props, option) => {
    return (
      <li {...props} key={uniqid()}>
        {option.label || option.id}
      </li>
    );
  }, []);

  const getOptionsDelayed = useCallback(
    debounce((query: string, callback: (options: AxiosResponse<any[]>) => void) => {
      setOptions([]);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      const controller = new AbortController();
      controllerRef.current = controller;
      getOptionsAsync(query).then(callback);
    }, 300),
    [getOptionsUrl],
  );

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      getOptionsDelayed(searchQuery, ({ data: options }: AxiosResponse<any[]>) => {
        onOptionsUpdated && onOptionsUpdated(options);
        setOptions(optionsTransform ? optionsTransform(options) : options);
        controllerRef.current = null;
        setIsLoading(false);
      });
    } else {
      setOptions([]);
    }
  }, [searchQuery, getOptionsDelayed]);

  useEffect(() => {
    value !== undefined && setLocalValue(value);
  }, [value]);

  useEffect(() => {
    localValue !== undefined && !isEqual(localValue, value) && onChange(localValue);
  }, [localValue]);

  const onAutocompleteChange = (event: unknown, value: AutocompleteAsyncOptionType | null) => {
    setLocalValue(value);
  };

  const onInputChange = (event: unknown, value: string) => {
    setSearchQuery(value);
  };

  const getOptionLabel = ({ label }: AutocompleteAsyncOptionType): string => {
    if (!label) return '';
    return capitalizedLabel ? capitalizeFirstLetter(label) : label;
  };

  const filterOptions = (options: AutocompleteAsyncOptionType[]): AutocompleteAsyncOptionType[] => options;

  return (
    <Box sx={{ width: fullWidth ? 1 : 'auto' }}>
      <Stack direction="row" sx={{ position: 'relative' }}>
        <Autocomplete
          options={options}
          value={localValue}
          onChange={onAutocompleteChange}
          onInputChange={onInputChange}
          getOptionLabel={getOptionLabel}
          filterOptions={filterOptions}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          loading={isLoading}
          disabled={isDisabled}
          PaperComponent={CustomPaper}
          fullWidth={fullWidth}
          sx={[
            ({ spacing }) => ({
              flex: 1,
              '& .MuiAutocomplete-inputRoot': {
                p: `${spacing(2.375, 4, 0, 1.5)} !important`,
              },
              '& input': {
                p: `${spacing(0.875, 0.5, 0.875, 0.5)} !important`,
              },
            }),
            ...convertSxToArray(sx),
          ]}
          renderOption={renderOptionCallback}
          renderInput={(params) => {
            const hasValue = Boolean(localValue?.label);
            return (
              <TextField
                {...params}
                helperText={error?.message || null}
                error={!!error}
                label={label}
                variant="filled"
                required={required}
                fullWidth={fullWidth}
                InputProps={{
                  ...params.InputProps,
                  onBlur,
                  endAdornment: (
                    <>
                      {Boolean(error) && (
                        <ErrorIcon
                          sx={(theme) => ({
                            position: 'absolute',
                            right: theme.spacing(1.5),
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: theme.palette.error.main,
                            pointerEvents: 'none',
                          })}
                        />
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
                }}
                inputProps={{
                  ...params.inputProps,
                  'data-testid': `${name}Autocomplete`,
                }}
                sx={[
                  !!error && {
                    '& .MuiInputBase-root': { backgroundColor: `rgba(186, 27, 27, .08)` },
                  },
                ]}
                inputRef={fieldRef}
              />
            );
          }}
        />
      </Stack>
    </Box>
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
