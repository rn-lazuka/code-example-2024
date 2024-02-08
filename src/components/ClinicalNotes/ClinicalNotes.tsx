import { ClinicalNotesPlaces, ClinicalNoteTypes } from '@enums';
import { useDispatchOnUnmount } from '@hooks/useDispatchOnUnmount';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@hooks/storeHooks';
import { useClinicalNotes } from '@hooks/useClinicalNotes';
import { GlobalAddButtonWithChips } from '@components/GlobalAddButtonWithChips/GlobalAddButtonWithChips';
import { addDrawer, resetClinicalNotes, setSelectedClinicalNoteType } from '@store/slices';
import { DrawerType } from '@enums/containers';
import { ROUTES } from '@constants/global';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ClinicalNotesFilters } from '@components/ClinicalNotes/components/ClinicalNotesFilters';
import { ClinicalNotesList } from '@components/ClinicalNotes/components/ClinicalNotesList';
import { ScrollToTopButton } from '@src/components';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useRef } from 'react';

type ClinicalNotesProps = {
  place: ClinicalNotesPlaces;
  patientId?: number;
};

export const ClinicalNotes = ({ place, patientId }: ClinicalNotesProps) => {
  const { t } = useTranslation('clinicalNotes');
  const dispatch = useAppDispatch();
  const { isShowAddButton, clinicalNoteTypeChips, getSelectedClinicalNoteKey } = useClinicalNotes(place, patientId);
  const containerRef = useRef(null);
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useDispatchOnUnmount(resetClinicalNotes());

  const onAddButtonChipClick = (label: string) => {
    dispatch(setSelectedClinicalNoteType(getSelectedClinicalNoteKey(label) as ClinicalNoteTypes));
    dispatch(
      addDrawer(
        place === ClinicalNotesPlaces.Profile && patientId
          ? {
              type: DrawerType.ClinicalNotesForm,
              payload: {
                id: patientId,
                place,
              },
              allowedPathsToShowDrawer: [ROUTES.patientsOverview],
            }
          : {
              type: DrawerType.ClinicalNotesForm,
              payload: { place },
            },
      ),
    );
  };

  return (
    <>
      {isShowAddButton && place !== ClinicalNotesPlaces.Header && (
        <GlobalAddButtonWithChips chips={clinicalNoteTypeChips} onChipClick={(label) => onAddButtonChipClick(label)} />
      )}
      <Stack
        direction="column"
        sx={{ width: 1, height: 1, p: 0, overflow: 'auto', backgroundColor: (theme) => theme.palette.surface.default }}
        ref={containerRef}
      >
        {isXs && <ScrollToTopButton containerRef={containerRef} />}
        <Box
          sx={({ palette }) => ({
            px: { xs: 2, sm: 3 },
            py: 2,
            borderBottom: `solid 1px ${palette.border.default}`,
          })}
        >
          <Typography
            data-testid="clinicalNotesPageHeader"
            variant={place === ClinicalNotesPlaces.Header ? 'headerL' : 'headerM'}
          >
            {t('clinicalNotes')}
          </Typography>
        </Box>
        <ClinicalNotesFilters place={place} />
        <ClinicalNotesList place={place} patientId={patientId} />
      </Stack>
    </>
  );
};
