import { format } from 'date-fns';

export const getGenerateReportDate = () => {
  return `(generated ${format(new Date(), 'dd/MM/yyyy')})`;
};
