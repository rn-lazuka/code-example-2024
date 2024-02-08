import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CollapseButton from '@components/CollapseButton/CollapseButton';

type DialysisServiceCardProps = PropsWithChildren<{
  title: string;
  isXs: boolean;
  isCollapsable?: boolean;
}>;

const DialysisServiceCard = ({ title, isXs, children, isCollapsable }: DialysisServiceCardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(!!isCollapsable);

  return (
    <>
      <Stack
        direction="column"
        sx={({ spacing, palette }) => ({
          width: '100%',
          maxWidth: spacing(87),
          backgroundColor: palette.surface.default,
          padding: isCollapsable ? spacing(2, 3) : spacing(3),
          borderRadius: spacing(2),
          '& .MuiPaper-root': {
            backgroundColor: 'initial',
            padding: 0,
            borderRadius: 0,
          },
        })}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            mb: isCollapsable ? 0 : 3,
          }}
        >
          {isCollapsable && (
            <CollapseButton
              sx={{ mr: 3 }}
              isCollapsed={!isCollapsed}
              onClick={() => setIsCollapsed((prevState) => !prevState)}
            />
          )}

          <Typography variant={isXs ? 'headerS' : 'headerM'} sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Stack>
        <Collapse
          data-testid="cardWithIconCollapse"
          in={!isCollapsed}
          sx={[
            {
              flexShrink: 0,
              pt: 0,
              transition: '.3s',
            },
            !!isCollapsable && !isCollapsed && { pt: 3 },
          ]}
        >
          {children || (
            <>
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </>
          )}
        </Collapse>
      </Stack>
    </>
  );
};

export default DialysisServiceCard;
