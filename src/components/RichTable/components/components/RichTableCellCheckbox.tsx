import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';

interface RichTableCellCheckboxProps {
  checked: boolean;
  isIndeterminate: boolean;
  onRowSelect?: () => void;
  data: any;
  fullData: any;
  rowCheckboxDisabledCondition: (rowData: any) => boolean;
}

const RichTableCellCheckbox = ({
  checked,
  isIndeterminate,
  rowCheckboxDisabledCondition = () => false,
  onRowSelect,
  data,
  fullData,
}: RichTableCellCheckboxProps) => {
  const isDisabled = useMemo(() => {
    return rowCheckboxDisabledCondition(fullData);
  }, [fullData]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Checkbox
        disabled={isDisabled}
        checked={checked}
        indeterminate={isIndeterminate}
        onChange={onRowSelect}
        sx={{ p: 0, borderRadius: 0 }}
        // @ts-ignore
        inputProps={{ 'data-testid': `TableCellCheckbox-${fullData.id}` }}
      />
      <Typography variant="paragraphM">{data}</Typography>
    </Stack>
  );
};

export default RichTableCellCheckbox;
