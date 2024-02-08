import { Link, useLocation } from 'react-router-dom';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { useTranslation } from 'react-i18next';
import { StyledListItem } from '../../Header/components/NavigationDrawer/components/Menu.styles';
import { ViewPermissions } from '@enums';
import { ROUTES } from '@constants';

export type MenuItemProps = {
  title: string;
  icon: OverridableComponent<SvgIconTypeMap>;
  path: string;
  basePath?: string;
  viewPermissions?: ViewPermissions[];
};

export type SidebarMenuItemProps = {
  item: MenuItemProps;
  userId?: string;
};

export const SidebarMenuItem = ({ userId, item }: SidebarMenuItemProps) => {
  const { t } = useTranslation('common');
  const { icon: Icon } = item;
  const location = useLocation();
  const basePath = item?.basePath ?? ROUTES.patientsOverview;
  const path = userId ? `/${basePath}/${userId}/${item.path}` : `/${basePath}/${item.path}`;

  return (
    <Link to={path}>
      <StyledListItem
        selected={location.pathname === path}
        sx={(theme) => ({
          display: 'flex',
          p: { xs: 0.5, md: theme.spacing(1.5, 1) },
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: {
            xs: theme.spacing(9),
            md: 'unset',
          },
        })}
      >
        <Icon
          sx={{
            mr: { xs: 0, md: 2 },
          }}
        />
        <ListItemText
          sx={{
            m: 0,
            width: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: { xs: 'center', md: 'start' },
          }}
          disableTypography
          primary={
            <Typography
              sx={({ breakpoints, typography }) => ({
                ...typography.labelSCapsSB,
                [breakpoints.down('md')]: {
                  ...typography.labelXXSCapsSB,
                },
                m: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              })}
            >
              {t(item.title)}
            </Typography>
          }
        />
      </StyledListItem>
    </Link>
  );
};
