import type { ClinicalNoteTypeOptionType } from '@types';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ClinicalNotesPlaces, ClinicalNoteTypes, DrawerType, UserPermissions } from '@enums';
import { Dictionaries, getOptionListFromCatalog } from '@utils';
import {
  addDrawer,
  getClinicalNotesList,
  selectAvailableClinicalNoteTypes,
  selectClinicalNoteForm,
  selectClinicalNotesFilters,
  selectHasActiveDrawers,
  selectUserPermissions,
  setAvailableClinicalNoteTypes,
} from '@store/slices';
import { useAppDispatch } from '@hooks';
import { ROUTES } from '@constants/global';

export const useClinicalNotes = (place: ClinicalNotesPlaces, patientId?: number) => {
  const dispatch = useAppDispatch();
  const { t: tClinicalNoteTypes } = useTranslation(Dictionaries.ClinicalNoteType);
  const userPermissions = selectUserPermissions();
  const hasActiveDrawer = selectHasActiveDrawers();
  const availableClinicalNoteTypes = selectAvailableClinicalNoteTypes();
  const formData = selectClinicalNoteForm();
  const filters = selectClinicalNotesFilters();
  const allowedPermissionsToAddClinicalNote = [
    UserPermissions.IssueModify,
    UserPermissions.ClinicalNoteDoctorModify,
    UserPermissions.ClinicalNoteNurseModify,
    UserPermissions.NephrologistReviewModify,
    UserPermissions.PICReviewModify,
  ];

  const clinicalNotesTypes = [
    {
      label: tClinicalNoteTypes(ClinicalNoteTypes.NurseNote),
      permissions: [UserPermissions.ClinicalNoteNurseModify],
    },
    {
      label: tClinicalNoteTypes(ClinicalNoteTypes.DoctorNote),
      permissions: [UserPermissions.ClinicalNoteDoctorModify],
    },
    { label: tClinicalNoteTypes(ClinicalNoteTypes.Issue), permissions: [UserPermissions.IssueModify] },
    {
      label: tClinicalNoteTypes(ClinicalNoteTypes.NephrologistReview),
      permissions: [UserPermissions.NephrologistReviewModify],
    },
    {
      label: tClinicalNoteTypes(ClinicalNoteTypes.PICReview),
      permissions: [UserPermissions.PICReviewModify],
    },
  ];

  const isShowAddButton =
    allowedPermissionsToAddClinicalNote.some((item) => userPermissions.includes(item)) && !hasActiveDrawer;

  const clinicalNoteTypeChips = useMemo(
    () => availableClinicalNoteTypes.map((item) => ({ label: item.label })),
    [availableClinicalNoteTypes],
  );

  const getSelectedClinicalNoteKey = (label: string) => {
    return getOptionListFromCatalog(Dictionaries.ClinicalNoteType)?.find((item) => item.label === label)?.value;
  };

  useEffect(() => {
    if (place === ClinicalNotesPlaces.Profile && formData) {
      dispatch(
        addDrawer({
          type: DrawerType.ClinicalNotesForm,
          payload: { id: patientId, place },
          allowedPathsToShowDrawer: [ROUTES.patientsOverview],
        }),
      );
    }
  }, [formData]);

  useEffect(() => {
    const filteredNoteTypesByPermission = clinicalNotesTypes.filter((item) =>
      item.permissions.some((permission) => userPermissions.includes(permission)),
    );
    const mappedNoteTypes = filteredNoteTypesByPermission.map((item) => ({
      label: item.label,
      value: getSelectedClinicalNoteKey(item.label),
    }));
    dispatch(setAvailableClinicalNoteTypes(mappedNoteTypes as ClinicalNoteTypeOptionType));
  }, [userPermissions]);

  useEffect(() => {
    dispatch(
      getClinicalNotesList(
        place === ClinicalNotesPlaces.Profile && patientId ? { patientId: +patientId, place } : { place },
      ),
    );
  }, [filters, patientId]);

  return { isShowAddButton, clinicalNoteTypeChips, getSelectedClinicalNoteKey };
};
