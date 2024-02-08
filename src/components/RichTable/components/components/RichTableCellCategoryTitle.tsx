import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

interface RichTableCellCategoryTitleProps {
  title?: ReactNode;
}

const RichTableCellCategoryTitle = ({ title }: RichTableCellCategoryTitleProps) => {
  return <Typography variant="labelM">{title || '—'}</Typography>;
};

export default RichTableCellCategoryTitle;
