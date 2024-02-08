import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';

let id = 0;

export const cardStackBlockFixture = (data: any = {}): any => {
  return {
    id: id++,
    title: `Card Title ${id}`,
    icon: InventoryOutlinedIcon,
    link: '/link',
    permission: 'TEST_PERMISSION',
    ...data,
  };
};
