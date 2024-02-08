import { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { WithSx } from '@types';
import { convertSxToArray } from '@utils/converters';
import { DataRowItem as Item } from '@components/DataRow/DataRowItem.styled';

type DataRowProps = WithSx<{
  title: ReactNode;
  titleColor?: string;
  value: ReactNode;
  additionalValue?: ReactNode;
  skipEmpty?: boolean;
  isCompact?: boolean;
}>;

export const DataRow = ({
  title,
  titleColor,
  isCompact = false,
  value,
  additionalValue,
  skipEmpty = false,
  sx,
}: DataRowProps) => {
  if (skipEmpty && !value) return null;

  return (
    <Stack
      direction="row"
      spacing={4}
      mt="0 !important"
      sx={[
        {
          pt: 0,
          '& .MuiPaper-root': { backgroundColor: 'transparent !important' },
          '& a': { color: ({ palette }) => palette.primary.main },
        },
        isCompact && {
          flexWrap: 'wrap',
        },
        ...convertSxToArray(sx),
      ]}
    >
      <Item
        sx={[
          {
            order: 1,
            pl: 0,
            minWidth: isCompact ? '100%' : (theme) => theme.spacing(20),
            maxWidth: isCompact ? '100%' : (theme) => theme.spacing(20),
          },
          isCompact && {
            flexBasis: '70%',
            py: 0,
          },
        ]}
      >
        <Typography
          className="dataRowFirstItem"
          variant="labelM"
          sx={[{ color: (theme) => titleColor || theme.palette.text.secondary }, isCompact && { textAlign: 'left' }]}
        >
          {title}
        </Typography>
      </Item>
      <Item
        sx={[
          { order: 2, width: additionalValue ? (theme) => theme.spacing(19.25) : 1 },
          isCompact && { order: 3, py: 0, flexBasis: '100%' },
        ]}
      >
        {typeof value === 'string' || typeof value === 'undefined' ? (
          <Typography
            className="dataRowSecondItem"
            variant="labelM"
            sx={(theme) => ({
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
              '& > a': { color: theme.palette.primary.main },
            })}
          >
            {value || '—'}
          </Typography>
        ) : (
          value
        )}
      </Item>
      {additionalValue && (
        <Item
          sx={[
            { position: 'relative', order: 3, width: (theme) => theme.spacing(15), flexGrow: 1 },
            isCompact && { order: 2, flexBasis: '30%' },
          ]}
        >
          <Typography
            className="dataRowThirdItem"
            variant="labelM"
            sx={(theme) => ({ '& > a': { color: theme.palette.primary.main } })}
          >
            {additionalValue}
          </Typography>
        </Item>
      )}
    </Stack>
  );
};
