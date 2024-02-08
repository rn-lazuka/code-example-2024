import Typography from '@mui/material/Typography';

interface RichTableCellAutoIncrementProps {
  rowIndex: number;
  pagination?: { currentPage: number; perPage: number };
}

const RichTableCellAutoIncrement = ({ rowIndex, pagination }: RichTableCellAutoIncrementProps) => {
  let index: number | string = rowIndex + 1;
  if (pagination) index += pagination.currentPage * pagination.perPage;
  if (index < 10) index = `0${index}`;
  return <Typography variant="labelM">{index}</Typography>;
};

export default RichTableCellAutoIncrement;
