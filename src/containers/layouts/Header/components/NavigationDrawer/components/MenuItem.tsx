import { Link, useLocation } from 'react-router-dom';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { StyledListItem } from './Menu.styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { useTranslation } from 'react-i18next';

export type ItemProps = {
  id: string;
  name: string;
  isOpen: boolean;
  icon: OverridableComponent<SvgIconTypeMap>;
  link: string;
  permission: string;
  active?: boolean;
};

export type MenuItemProps = {
  onClose: () => void;
  item: ItemProps;
};

export const MenuItem = ({ item, onClose }: MenuItemProps) => {
  const { t } = useTranslation('common');
  const { icon: Icon } = item;
  const location = useLocation();

  if (item?.active === false) return null;

  return (
    <Link to={item.link}>
      <StyledListItem onClick={onClose} selected={location.pathname === item.link}>
        <Icon sx={{ mr: 2 }} />
        <ListItemText
          sx={{ m: 0 }}
          disableTypography
          primary={<Typography variant="labelSCapsSB">{t(item.name)}</Typography>}
        />
      </StyledListItem>
    </Link>
  );
};
