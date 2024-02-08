import Typography from '@mui/material/Typography';
import type { DialysisProcessInfoForProgress } from '@types';
import { DialysisProgressInfoBlockVariants } from '@enums';
import { DialysisProgressInfoBlock } from '@components/DialysisProgressInfoBlock/DialysisProgressInfoBlock';

interface RichTableCellHdProgressProps {
  data: any;
  fullData: any;
  cellCallback?: (data: any) => void;
}

const RichTableCellHdProgress = ({ data, fullData, cellCallback = () => {} }: RichTableCellHdProgressProps) => {
  const dataForProgressInfoBlock: DialysisProcessInfoForProgress = {
    status: fullData?.status,
    startTime: fullData?.startTime,
    endTime: fullData?.endTime,
  };

  if (dataForProgressInfoBlock.status) {
    return (
      <DialysisProgressInfoBlock
        variant={DialysisProgressInfoBlockVariants.Table}
        dialysisProcessInfo={dataForProgressInfoBlock}
        checkInfoHandler={() => {
          cellCallback && cellCallback(data);
        }}
      />
    );
  }
  return <Typography variant="labelM">—</Typography>;
};

export default RichTableCellHdProgress;
