import type { ReactNode, Ref, SyntheticEvent } from 'react';
import type { FieldError } from 'react-hook-form/dist/types';
import type { WithSx } from '@types';
import Box from '@mui/material/Box';
import ErrorIcon from '@mui/icons-material/Error';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CustomPaper } from '@components/autocompletes/AutocompleteFreeSolo/components/CustomPaper';
import { capitalizeFirstLetter, convertSxToArray } from '@utils';
import { debounce } from '@mui/material';

type AutocompleteBasicOption = {
  label: string;
  value: string | number;
  group?: string;
};

type AutocompleteBasicProps = WithSx<{
  name: string;
  options: AutocompleteBasicOption[] | string[];
  label?: string | ReactNode;
  isDisabled?: boolean;
  fullWidth?: boolean;
  value: AutocompleteBasicOption;
  onChange: (value) => void;
  onBlur?: () => void;
  required?: boolean;
  capitalizedLabel?: boolean;
  loading?: boolean;
  groupBy?: (option: AutocompleteBasicOption) => string;
  error?: FieldError;
  fieldRef?: Ref<HTMLElement>;
}>;

export const AutocompleteBasic = ({
  name,
  options,
  label,
  isDisabled,
  fullWidth = true,
  value,
  required,
  onChange,
  onBlur,
  capitalizedLabel = true,
  loading,
  error,
  fieldRef,
  sx = [],
}: AutocompleteBasicProps) => {
  const formattedOptions = options.map((option) => {
    if (typeof option === 'string') return { label: option, value: option };
    return option ? option : { label: '', value: null };
  });

  const onAutocompleteChange = (
    event: SyntheticEvent<Element, Event>,
    value: string | AutocompleteBasicOption | null,
  ) => {
    onChange(typeof value === 'string' ? { value, label: value } : value);
  };

  const onAutocompleteInput = debounce((event: any, value: any) => {
    const result = formattedOptions.find((option) => option.label.toLowerCase() === value.toLowerCase());
    if (result) onChange(result);
  }, 300);

  const getOptionLabel = ({ label }: AutocompleteBasicOption): string => {
    if (!label) return '';
    return capitalizedLabel ? capitalizeFirstLetter(label) : label;
  };

  return (
    <Box sx={{ width: fullWidth ? 1 : 'auto' }}>
      <Stack direction="row" sx={{ position: 'relative' }}>
        <Autocomplete
          value={value}
          loading={loading}
          options={formattedOptions}
          getOptionLabel={getOptionLabel}
          onChange={onAutocompleteChange}
          onInputChange={onAutocompleteInput}
          disabled={isDisabled}
          PaperComponent={CustomPaper}
          isOptionEqualToValue={(option, value) => option.label === value.label}
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
          renderInput={(params) => {
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
                    </>
                  ),
                }}
                inputProps={{
                  ...params.inputProps,
                  'data-testid': `${name}AutocompleteBasic`,
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
