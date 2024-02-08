import type { ReactNode, Ref } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AxiosResponse } from 'axios';
import debounce from 'lodash/debounce';
import TextField from '@mui/material/TextField';
import type { FieldError } from 'react-hook-form/dist/types';
import type { WithSx } from '@types';
import { API, capitalizeFirstLetter } from '@utils';
import { convertSxToArray } from '@utils/converters/mui';
import { StyledFormAutocomplete } from '@src/components/FormComponents/Form.styles';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IconButton, InputAdornment } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import ClearIcon from '@mui/icons-material/Clear';

type AutocompleteFreeSoloProps = WithSx<{
  error?: FieldError;
  label?: string;
  required?: boolean;
  onChange: (value) => void;
  isDisabled?: boolean;
  value: { value: string; label: string };
  name: string;
  capitalizedLabel?: boolean;
  InputProps?: {
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
  };
  getOptionsUrl: string;
  optionsTransform?: (options: any) => any;
  placeholder?: string;
  fieldRef?: Ref<any>;
}>;

export const AutocompleteFreeSoloAsyncMultiple = ({
  label,
  error,
  required,
  onChange,
  isDisabled,
  getOptionsUrl,
  value,
  name,
  placeholder,
  optionsTransform,
  sx = [],
  fieldRef,
}: AutocompleteFreeSoloProps) => {
  const [options, setOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>();

  const getOptionsAsync = async (query: string): Promise<AxiosResponse<string[]>> => {
    return API.get(`${getOptionsUrl}${query}`, { signal: controllerRef.current?.signal });
  };

  const getOptionsDelayed = useCallback(
    debounce((query: string, callback: (options: AxiosResponse<string[]>) => void) => {
      setOptions([]);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      // TODO: Uncommit it when will be ready integration with MIMS
      // getOptionsAsync(query)
      //   .then(callback)
      //   .catch((error) => {
      //     console.error(error);
      //     setOptions([searchQuery]);
      //   });
      setOptions([searchQuery]);
      setIsLoading(false);
    }, 300),
    [searchQuery],
  );

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      getOptionsDelayed(searchQuery.slice(0, 120), ({ data: options }: AxiosResponse<string[]>) => {
        setOptions(optionsTransform ? optionsTransform(options) : options);
        controllerRef.current = null;
        setIsLoading(false);
      });
    } else {
      setOptions([]);
    }
  }, [searchQuery, getOptionsDelayed]);

  useEffect(() => {
    setSearchQuery(value ? value.label : '');
  }, [value]);

  return (
    <StyledFormAutocomplete
      value={value}
      freeSolo
      multiple
      options={options}
      getOptionLabel={(option) => capitalizeFirstLetter(option)}
      ChipProps={{ deleteIcon: <CloseOutlinedIcon /> }}
      onChange={(event, values) => {
        setSearchQuery('');
        onChange(values);
      }}
      disabled={isDisabled}
      loading={isLoading}
      required={required}
      renderInput={(params) => {
        const hasValue = Array.isArray(value) ? Boolean(value?.length) : Boolean(value);

        return (
          <TextField
            {...params}
            label={label}
            hiddenLabel
            variant="filled"
            onInput={(event) => {
              setSearchQuery((event.target as HTMLInputElement).value);
            }}
            required={required}
            disabled={isDisabled}
            placeholder={placeholder}
            error={!!error}
            helperText={error ? error.message : null}
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
                  {Boolean(hasValue) && !isDisabled && (
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
                          setSearchQuery('');
                          onChange([]);
                        }}
                      >
                        <ClearIcon sx={{ fontSize: '1.25rem' }} />
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              ),
            }}
            inputProps={{
              ...params.inputProps,
              value: searchQuery,
              'data-testid': `${name}AutocompleteFreeSoloAsyncMultiple`,
            }}
            inputRef={fieldRef}
          />
        );
      }}
      sx={[
        !!error && {
          '& .MuiAutocomplete-inputRoot': { backgroundColor: `rgba(186, 27, 27, .08)`, pr: 0 },
        },
        ...convertSxToArray(sx),
      ]}
    />
  );
};
