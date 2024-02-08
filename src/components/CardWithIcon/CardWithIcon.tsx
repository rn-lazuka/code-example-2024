import { useMediaQuery } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import type { WithSx } from '@types';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { PropsWithChildren, useEffect, useState } from 'react';
import { EmptyCardContent } from './components/EmptyCardContent';
import { convertSxToArray } from '@utils/converters/mui';
import ExpandMore from '@mui/icons-material/ExpandMore';

export type CardWithIconProps = WithSx<
  PropsWithChildren<{
    title: string;
    icon?: OverridableComponent<SvgIconTypeMap> | null;
    action?: OverridableComponent<any> | null;
    onIconClick?: () => void;
    onActionClick?: () => void;
    onAddContent?: () => void;
    addContentPermission?: boolean;
    isMobileViewAllowed?: boolean;
  }>
>;

export const CardWithIcon = ({
  icon: Icon,
  action: Action,
  title,
  onAddContent,
  isMobileViewAllowed = true,
  addContentPermission,
  onIconClick = () => {},
  onActionClick = () => {},
  children,
  sx = [],
}: CardWithIconProps) => {
  const [expandStatus, setExpandStatus] = useState(false);
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!isXs) {
      setExpandStatus(false);
    }
  }, [isXs]);

  return (
    <Paper
      sx={[
        (theme) => {
          const pbExpand = expandStatus ? 1 : 0;
          return {
            minWidth: theme.spacing(43.25),
            pt: theme.spacing(1),
            pr: theme.spacing(isXs ? 2 : 3),
            pb: !isXs ? 3 : pbExpand,
            pl: theme.spacing(isXs ? 2 : 3),
          };
        },
        isXs &&
          !isMobileViewAllowed && {
            pb: 2,
          },
        ...convertSxToArray(sx),
      ]}
    >
      <Box
        className="cardWithIconTitleWrapper"
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 1,
          height: theme.spacing(5),
          mb: 1,
        })}
      >
        <Box display="flex" alignItems="center" onClick={() => (isXs ? setExpandStatus(!expandStatus) : null)}>
          {isXs && isMobileViewAllowed && children && (
            <ExpandMore
              sx={{ transform: expandStatus ? 'rotateZ(180deg)' : 'rotateZ(0deg)', transition: '.3s', mr: 2 }}
            />
          )}
          <Typography
            className="cardWithIconTitle"
            variant="headerS"
            sx={{ pointerEvents: isXs ? 'cursor' : 'initial' }}
          >
            {title}
          </Typography>
        </Box>
        {Icon && !Action && (
          <IconButton onClick={onIconClick} sx={{ m: 0, mr: -1 }}>
            <Icon />
          </IconButton>
        )}
        {Action && !Icon && <Action onClick={onActionClick} sx={{ m: 0, mr: -1 }} />}
      </Box>
      {onAddContent && !children && (
        <EmptyCardContent addContentPermission={addContentPermission} onClick={onAddContent} />
      )}
      <Collapse
        data-testid="cardWithIconCollapse"
        in={isXs && isMobileViewAllowed ? expandStatus : true}
        sx={{
          flexShrink: 0,
        }}
      >
        <Stack direction="column" sx={{ width: 1 }}>
          {children}
        </Stack>
      </Collapse>
    </Paper>
  );
};
