import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface HdPrescriptionDataRowProps {
  title: string;
  value?: string | number;
  additionalValue?: string | number;
}

const HdPrescriptionDataRow = ({ title, value, additionalValue }: HdPrescriptionDataRowProps) => {
  return (
    <Stack direction="row" spacing={4}>
      <Typography variant="labelM" sx={({ palette, spacing }) => ({ color: palette.text.darker, width: spacing(11) })}>
        {title}
      </Typography>
      <Stack direction="column">
        <Typography variant="labelM">{value}</Typography>
        <Typography variant="labelM">{additionalValue}</Typography>
      </Stack>
    </Stack>
  );
};

export default HdPrescriptionDataRow;
