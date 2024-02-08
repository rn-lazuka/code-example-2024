import { ReactNode, SyntheticEvent } from 'react';
import { StyledFormAutocomplete } from '../../FormComponents/Form.styles';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';

import { WithSx } from '@types';
import { Chip } from '@components';
import { convertSxToArray } from '@utils';
import { ChipColors, ChipVariants } from '@enums';

export interface AutocompleteMultipleOptionType {
  value: string;
  label: string;
  group?: string;
}

type AutocompleteMultipleProps = WithSx<{
  label?: string | ReactNode;
  placeholder?: string;
  freeSolo?: boolean;
  options: AutocompleteMultipleOptionType[];
  value: AutocompleteMultipleOptionType[];
  required?: boolean;
  isDisabled?: boolean;
  error?: string;
  onChange: (event: SyntheticEvent<Element, Event> | {}, value: unknown) => void;
  groupBy?: (option) => string;
  fullWidth?: boolean;
  disabledOptions?: string[];
  name: string;
}>;

export const AutocompleteMultiple = ({
  label,
  placeholder,
  freeSolo,
  options,
  required,
  isDisabled,
  error,
  disabledOptions = [],
  onChange,
  value,
  groupBy,
  sx,
  fullWidth,
  name,
}: AutocompleteMultipleProps) => {
  const getOptionDisabled = (option: AutocompleteMultipleOptionType) => {
    return disabledOptions.some((disabledOption) => disabledOption === option.label);
  };

  const handleDeleteChip = (chipToDelete: AutocompleteMultipleOptionType) => {
    const newValue = value.filter((val) => val.value !== chipToDelete.value);
    onChange({}, newValue);
  };

  const handleClearValue = () => {
    const newValue = value.filter((val) => disabledOptions.includes(val.label));
    onChange({}, newValue);
  };

  return (
    <Box sx={{ width: fullWidth ? 1 : 'auto' }}>
      <StyledFormAutocomplete
        multiple
        freeSolo={freeSolo}
        options={options}
        value={value}
        groupBy={groupBy}
        fullWidth={fullWidth}
        getOptionDisabled={getOptionDisabled}
        getOptionLabel={(option: AutocompleteMultipleOptionType) => option.label}
        renderTags={(tagValue: AutocompleteMultipleOptionType[]) =>
          tagValue.map((option) => (
            <Chip
              key={option.label}
              label={option.label}
              onClick={() => (disabledOptions.includes(option.label) ? undefined : handleDeleteChip(option))}
              variant={ChipVariants.fill}
              color={disabledOptions.includes(option.label) ? ChipColors.standard : ChipColors.blue}
              RightIcon={disabledOptions.includes(option.label) ? null : CloseIcon}
              sx={[
                ({ spacing, palette }) => ({
                  mr: spacing(1),
                  mt: spacing(1),
                  '&:hover': {
                    cursor: disabledOptions.includes(option.label) ? 'unset' : 'pointer',
                  },
                  '.MuiTypography-labelM': {
                    color: disabledOptions.includes(option.label) ? palette.neutral[60] : palette.text.black,
                  },
                }),
              ]}
            />
          ))
        }
        isOptionEqualToValue={(currentOption, selectedValue) => {
          const option: AutocompleteMultipleOptionType = currentOption as AutocompleteMultipleOptionType;
          const value: AutocompleteMultipleOptionType = selectedValue as AutocompleteMultipleOptionType;
          return option.value === value.value;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            hiddenLabel
            variant="filled"
            required={required}
            sx={({ spacing }) => ({
              '.MuiAutocomplete-input': { p: '0px !important', pt: `${spacing(1)} !important` },
              '.MuiInputBase-root': { pb: `${spacing(1)} !important`, pt: '0px !important' },
            })}
            disabled={isDisabled}
            placeholder={placeholder}
            error={!!error}
            helperText={error || null}
            inputProps={{
              ...params.inputProps,
              'data-testid': `${name}AutocompleteMultiple`,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {!isDisabled && value && value.length > 0 && (
                    <IconButton
                      className="autoCompleteMultipleClearButton"
                      aria-label="clear"
                      onClick={() => {
                        handleClearValue();
                        params.inputProps.onBlur(null);
                      }}
                    >
                      <ClearIcon className="autoCompleteMultipleClearIndicator" />
                    </IconButton>
                  )}
                </>
              ),
            }}
          />
        )}
        onChange={onChange}
        sx={convertSxToArray(sx)}
      />
    </Box>
  );
};
