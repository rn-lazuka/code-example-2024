import { ClinicalNotesPlaces } from '@enums';
import { useParams } from 'react-router-dom';
import { ClinicalNotes } from '@components/ClinicalNotes/ClinicalNotes';

export const PatientClinicalNotes = () => {
  const { id } = useParams();

  return <ClinicalNotes place={ClinicalNotesPlaces.Profile} patientId={id && !isNaN(+id) ? +id : undefined} />;
};
