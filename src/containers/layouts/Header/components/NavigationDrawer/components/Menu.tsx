import List from '@mui/material/List';
import { WithSx } from '@types';
import { ItemProps, MenuItem } from './MenuItem';
import { getRoutePermissions } from '@utils';
import { convertSxToArray } from '@utils/converters/mui';

export type MenuProps = WithSx<{
  onClose: () => void;
  items: ItemProps[];
}>;

export const Menu = ({ items, onClose, sx = [] }: MenuProps) => {
  const { showRoute } = getRoutePermissions();
  return (
    <List
      component="nav"
      sx={[
        {
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 1,
          textTransform: 'uppercase',
          width: 1,
          '& a': { width: 1 },
        },
        ...convertSxToArray(sx),
      ]}
    >
      {items.map((item) => {
        return (
          showRoute[item.permission] && <MenuItem key={`${item.name}${item.link}`} item={item} onClose={onClose} />
        );
      })}
    </List>
  );
};
