import Typography from '@mui/material/Typography';

type ClinicalNoteCardListItemTitleProps = {
  text: string;
};

export const ClinicalNoteCardListItemTitle = ({ text }: ClinicalNoteCardListItemTitleProps) => {
  return (
    <Typography variant="labelS" sx={({ palette, spacing }) => ({ color: palette.text.darker, flexBasis: spacing(9) })}>
      {text}
    </Typography>
  );
};
