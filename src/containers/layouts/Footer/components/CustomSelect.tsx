import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { StyledSelect } from '../Footer.styles';
import { WithSx } from '@types';
import { convertSxToArray } from '@utils/converters';

type Options = {
  id: string;
  name: string;
};

type CustomSelectProps = WithSx<{
  label: string;
  options: Options[];
  currentValue?: string;
  handleSelect: (value: string) => void;
  disabled?: boolean;
}>;

const CustomSelect = ({ options, currentValue = '', label, handleSelect, disabled, sx }: CustomSelectProps) => {
  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      sx={[
        {
          mb: { xs: 1, md: 0 },
          mr: { xs: 0, md: 1 },
        },
        ...convertSxToArray(sx),
      ]}
    >
      <Typography variant="paragraphXS" sx={(theme) => ({ color: theme.palette.text.darker, mr: 1 })}>
        {label}:
      </Typography>
      <StyledSelect
        value={currentValue}
        variant="standard"
        onChange={(e) => handleSelect(e.target.value as string)}
        SelectDisplayProps={{ style: { paddingRight: 16 } }}
        disabled={disabled}
        MenuProps={{ disableScrollLock: true }}
      >
        {options.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </StyledSelect>
    </Box>
  );
};

export default CustomSelect;
