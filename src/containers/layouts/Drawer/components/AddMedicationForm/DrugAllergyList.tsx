import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { AllergyChipItem } from '@components/pages/PatientProfile';

type DrugAllergyListProps = {
  allergyList: string[];
};

export const DrugAllergyList = ({ allergyList }: DrugAllergyListProps) => {
  const { t } = useTranslation('medications');

  if (!allergyList || !allergyList.length) {
    return <>{t('noAllergy')}</>;
  }

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="labelMCaps">{t('allergy')}</Typography>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          flexWrap: 'wrap',
          '& .MuiChip-root': {
            mb: 0.5,
          },
          '& .MuiChip-root:last-of-type, .MuiChip-root:first-of-type': {
            ml: 0.5,
          },
        }}
      >
        {allergyList.map((allergyItem) => (
          <AllergyChipItem name={allergyItem} key={allergyItem} />
        ))}
      </Stack>
    </Stack>
  );
};
