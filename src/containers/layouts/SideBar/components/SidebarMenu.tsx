import List from '@mui/material/List';
import { WithSx } from '@types';
import { MenuItemProps, SidebarMenuItem } from './SidebarMenuItem';
import { useParams } from 'react-router-dom';
import { PermissionGuard } from '@guards';
import { UserPermissions } from '@enums';
import { convertSxToArray } from '@utils/converters/mui';
import { Skeleton } from '@mui/material';

export type SidebarMenuProps = WithSx<{
  items: MenuItemProps[];
}>;

export const SidebarMenu = ({ items, sx = [] }: SidebarMenuProps) => {
  const { id } = useParams();

  return (
    <List
      component="nav"
      sx={[
        {
          p: 0,
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          alignItems: 'flex-start',
          height: 1,
          width: { md: 1 },
        },
        ...convertSxToArray(sx),
      ]}
    >
      {!!items.length &&
        items.map((item) => (
          <PermissionGuard
            key={`${item.title}${item.path}`}
            permissions={(item.viewPermissions as unknown as UserPermissions) || []}
          >
            <SidebarMenuItem item={item} userId={id} />
          </PermissionGuard>
        ))}
      {!items.length && (
        <>
          <Skeleton
            height={48}
            sx={(theme) => ({
              borderRadius: theme.spacing(1),
              width: { xs: theme.spacing(9), md: 1 },
              mr: { xs: theme.spacing(1), sm: 0 },
            })}
          />
          <Skeleton
            height={48}
            sx={(theme) => ({
              borderRadius: theme.spacing(1),
              width: { xs: theme.spacing(9), md: 1 },
              mr: { xs: theme.spacing(1), sm: 0 },
            })}
          />
          <Skeleton
            height={48}
            sx={(theme) => ({
              borderRadius: theme.spacing(1),
              width: { xs: theme.spacing(9), md: 1, mr: { xs: theme.spacing(1), sm: 0 } },
            })}
          />
          <Skeleton
            height={48}
            sx={(theme) => ({
              borderRadius: theme.spacing(1),
              width: { xs: theme.spacing(9), md: 1 },
              mr: { xs: theme.spacing(1), sm: 0 },
            })}
          />
          <Skeleton
            height={48}
            sx={(theme) => ({
              borderRadius: theme.spacing(1),
              width: { xs: theme.spacing(9), md: 1 },
              mr: { xs: theme.spacing(1), sm: 0 },
            })}
          />
          <Skeleton
            height={48}
            sx={(theme) => ({
              borderRadius: theme.spacing(1),
              width: { xs: theme.spacing(9), md: 1 },
              mr: { xs: theme.spacing(1), sm: 0 },
            })}
          />
          <Skeleton
            height={48}
            sx={(theme) => ({
              borderRadius: theme.spacing(1),
              width: { xs: theme.spacing(9), md: 1 },
              mr: { xs: theme.spacing(1), sm: 0 },
            })}
          />
          <Skeleton
            height={48}
            sx={(theme) => ({
              borderRadius: theme.spacing(1),
              width: { xs: theme.spacing(9), md: 1 },
              mr: { xs: theme.spacing(1), sm: 0 },
            })}
          />
        </>
      )}
    </List>
  );
};
