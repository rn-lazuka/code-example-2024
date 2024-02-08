import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { theme } from '@src/styles';
import { EnterLabResultsInfoData } from '@types';

type EnterLabResultsInfoBlockProps = { items: EnterLabResultsInfoData[] };

export const EnterLabResultsInfoBlock = ({ items }: EnterLabResultsInfoBlockProps) => {
  return (
    <Stack flexGrow={1} spacing={1}>
      {items.map((item) => (
        <Stack key={item.name} direction="row">
          <Typography sx={{ width: 0.5 }} variant="labelM" color={theme.palette.text.secondary}>
            {item.name}
          </Typography>
          <Typography sx={{ width: 0.5 }} flexGrow={1} variant="labelM">
            {item.value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
