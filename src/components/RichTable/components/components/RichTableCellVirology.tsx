import Typography from '@mui/material/Typography';
import { VirologyChip } from '@components/VirologyChip/VirologyChip';
import { useTranslation } from 'react-i18next';
import uniqId from 'uniqid';
import { useMemo } from 'react';

interface RichTableCellVirologyProps {
  data: any;
}

const RichTableCellVirology = ({ data }: RichTableCellVirologyProps) => {
  const { t: tCommon } = useTranslation('common');
  const uniqKey = useMemo(() => uniqId(), []);

  if (!data) return <Typography variant="labelM">{tCommon('noInfo')}</Typography>;
  return (
    <>
      {data.length > 0 ? (
        data.map((virus) => <VirologyChip name={virus} key={`${virus}-${uniqKey}`} />)
      ) : (
        <Typography variant="labelM">{tCommon('nonInfectious')}</Typography>
      )}
    </>
  );
};

export default RichTableCellVirology;
