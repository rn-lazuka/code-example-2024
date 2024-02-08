import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { SpecialNote } from '@enums';
import { EmergencyIcon } from '@assets/icons';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import { IconWithTooltip } from '@components/IconWithTooltip/IconWithTooltip';
import { theme } from '@src/styles';
import Typography from '@mui/material/Typography';
import uniqid from 'uniqid';

interface RichTableCellSpecialNotesProps {
  specialNotes: SpecialNote[];
}

const RichTableCellSpecialNotes = ({ specialNotes }: RichTableCellSpecialNotesProps) => {
  const { t } = useTranslation('todayPatients');

  const getNoteInfo = (specialNote: SpecialNote) => {
    switch (specialNote) {
      case SpecialNote.LabAnalysis:
        return { icon: ScienceOutlinedIcon, title: t('tableView.labTests') };
      case SpecialNote.AdditionalAttention:
        return { icon: EmergencyIcon, title: t('tableView.additionalAttention') };
      default:
        return { icon: MedicationOutlinedIcon, title: t('tableView.medicationsChanges') };
    }
  };

  if (!specialNotes || specialNotes.length === 0) return <Typography variant="labelM">—</Typography>;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {specialNotes.map((note) => {
        const noteInfo = getNoteInfo(note);
        return (
          <IconWithTooltip
            key={uniqid()}
            title={noteInfo.title}
            icon={noteInfo.icon}
            iconColor={theme.palette.error.main}
          />
        );
      })}
    </Stack>
  );
};

export default RichTableCellSpecialNotes;
