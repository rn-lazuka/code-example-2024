import {
  changeClinicalNotesPage,
  changeClinicalNotesRowsPerPage,
  selectClinicalNotesList,
  selectClinicalNotesTablePagination,
} from '@store/slices';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { ClinicalNoteCard } from '@components/ClinicalNotes/components/ClinicalNoteCard/ClinicalNoteCard';
import { PaginationComponent } from '@components/RichTable';
import Box from '@mui/material/Box';
import { theme } from '@src/styles';
import { ClinicalNotesPlaces } from '@enums';
import { EmptyDataBody } from '@components/EmptyDataBody/EmptyDataBody';

type ClinicalNotesListProps = {
  place: ClinicalNotesPlaces;
  patientId?: number;
};

export const ClinicalNotesList = ({ place, patientId }: ClinicalNotesListProps) => {
  const clinicalNotes = selectClinicalNotesList();
  const pagination = selectClinicalNotesTablePagination();

  if (place === ClinicalNotesPlaces.Profile && !patientId) return null;
  if (!clinicalNotes.length) return <EmptyDataBody />;

  return (
    <Box data-testid="ClinicalNotesList" sx={{ bgcolor: theme.palette.surface.default, pb: 2 }}>
      <PaginationComponent
        pagination={pagination}
        onChangePage={(page) => changeClinicalNotesPage({ paginationValue: page, patientId, place })}
        onChangeRowsPerPage={(rows) => changeClinicalNotesRowsPerPage({ paginationValue: rows, patientId, place })}
        sx={{ overflow: 'visible' }}
      />
      <Divider />
      <Stack direction="column">
        {clinicalNotes.map((note) => (
          <ClinicalNoteCard key={note.id} data={note} place={place} />
        ))}
      </Stack>
      <PaginationComponent
        pagination={pagination}
        onChangePage={(page) => changeClinicalNotesPage({ paginationValue: page, patientId, place })}
        onChangeRowsPerPage={(rows) => changeClinicalNotesRowsPerPage({ paginationValue: rows, patientId, place })}
        sx={{ overflow: 'visible' }}
      />
    </Box>
  );
};
