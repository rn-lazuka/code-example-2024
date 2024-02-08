import type { Action } from 'redux';
import type { AddOrEditClinicalNotePayload, ClinicalNotesResponse, GetClinicalNotesListPayload } from '@types';
import {
  addOrEditClinicalNote,
  addOrEditClinicalNoteError,
  addOrEditClinicalNoteSuccess,
  addSnack,
  clinicalNotesInitialState,
  deleteClinicalNote,
  deleteClinicalNoteSuccess,
  getClinicalNotesList,
  getClinicalNotesListSuccess,
  removeDrawer,
  setClinicalNotesListError,
} from '@store';
import i18n from 'i18next';
import { runSagaHandler } from '@unit-tests';
import { API } from '@utils/api';
import { ClinicalNotesPlaces, ClinicalNoteTypes, DrawerType, PatientStatuses, SnackType } from '@enums';
import { addOrEditClinicalNoteSaga, deleteClinicalNoteSaga, getClinicalNotesListSaga } from '@sagas/clinicalNotesSaga';
import { endOfDay, startOfDay } from 'date-fns';

describe('clinicalNotesSaga', () => {
  afterAll(() => jest.clearAllMocks());

  describe('Add/Edit ClinicalNoteSaga', () => {
    const addClinicalNotePayloadMock: AddOrEditClinicalNotePayload = {
      isAdding: true,
      clinicalNote: {
        type: ClinicalNoteTypes.Issue,
        note: '',
      },
      patientId: 1,
      place: ClinicalNotesPlaces.Profile,
    };
    const updateClinicalNotePayloadMock: AddOrEditClinicalNotePayload = {
      ...addClinicalNotePayloadMock,
      isAdding: false,
      place: ClinicalNotesPlaces.Profile,
    };
    const selectedClinicalNoteIdMock = 1;

    const clinicalNoteSagaCheck = (
      description: string,
      apiData: { method: 'put' | 'post'; path: string },
      successMessage: string,
    ) => {
      const isAdding = apiData.method === 'post';
      const payloadMock = isAdding ? addClinicalNotePayloadMock : updateClinicalNotePayloadMock;
      it(`${description}`, async () => {
        API[apiData.method] = jest.fn().mockResolvedValue({});
        const dispatched: Action[] = [];

        await runSagaHandler(
          dispatched,
          { clinicalNotes: { selectedClinicalNoteId: selectedClinicalNoteIdMock } },
          addOrEditClinicalNoteSaga,
          {
            type: addOrEditClinicalNote.type,
            payload: payloadMock,
          },
        );

        expect(API[apiData.method]).toHaveBeenCalledWith(
          apiData.path,
          {
            ...payloadMock.clinicalNote,
            patientId: payloadMock.patientId,
          },
          { headers: { 'multiline-fields': 'note' } },
        );
        expect(dispatched).toEqual([
          { type: addOrEditClinicalNoteSuccess.type },
          {
            type: addSnack.type,
            payload: { type: SnackType.Success, message: successMessage },
          },
          { type: removeDrawer.type, payload: DrawerType.ClinicalNotesForm },
          { type: getClinicalNotesList.type, payload: { patientId: payloadMock.patientId, place: payloadMock.place } },
        ]);
      });
    };

    clinicalNoteSagaCheck(
      'should correctly handle add clinical note',
      { method: 'post', path: '/pm/clinical-notes' },
      i18n.t('clinicalNotes:form.clinicalNoteCreated'),
    );
    clinicalNoteSagaCheck(
      'should correctly handle update clinical note',
      { method: 'put', path: `/pm/clinical-notes/${selectedClinicalNoteIdMock}` },
      i18n.t('clinicalNotes:form.clinicalNoteUpdated'),
    );

    it('should handle error', async () => {
      API.post = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];

      await runSagaHandler(
        dispatched,
        { clinicalNotes: { selectedClinicalNoteId: selectedClinicalNoteIdMock } },
        addOrEditClinicalNoteSaga,
        {
          type: addOrEditClinicalNote.type,
          payload: addClinicalNotePayloadMock,
        },
      );

      expect(dispatched).toEqual([
        { type: addOrEditClinicalNoteError.type, payload: new Error() },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('hdPrescription:form.updateFailed') },
        },
      ]);
    });
  });

  describe('getClinicalNotesListSaga', () => {
    const userIdMock = 3;
    const getClinicalNotePayloadMock: GetClinicalNotesListPayload = {
      patientId: 1,
      place: ClinicalNotesPlaces.Profile,
    };
    const clinicalNotesStoreNeededFieldsMock = {
      clinicalNotes: { pagination: { currentPage: 1, perPage: 30 }, filters: clinicalNotesInitialState.filters },
      user: { user: { id: userIdMock } },
    };
    const clinicalNoteDataMock: ClinicalNotesResponse = {
      content: [
        {
          id: 1,
          patient: { id: 1, name: 'Test Name', status: PatientStatuses.Permanent },
          type: ClinicalNoteTypes.Issue,
          note: '',
          details: '',
          enteredAt: '',
          enteredBy: { id: 1, name: '', deleted: false },
        },
      ],
      totalElements: 100,
      totalPages: 10,
      size: 10,
      first: true,
      last: false,
    } as ClinicalNotesResponse;
    const dateMock = new Date();

    const checkGetClinicalNotesListSaga = (description: string, state: any, dataToSend: any) => {
      it(`${description}`, async () => {
        API.post = jest.fn().mockResolvedValue({ data: clinicalNoteDataMock });
        const dispatched: Action[] = [];

        await runSagaHandler(dispatched, state, getClinicalNotesListSaga, {
          type: getClinicalNotesList.type,
          payload: getClinicalNotePayloadMock,
        });

        expect(API.post).toHaveBeenCalledWith('/pm/clinical-notes/search', dataToSend, {
          params: {
            page: clinicalNotesStoreNeededFieldsMock.clinicalNotes.pagination.currentPage,
            size: clinicalNotesStoreNeededFieldsMock.clinicalNotes.pagination.perPage,
          },
        });
        expect(dispatched).toEqual([{ type: getClinicalNotesListSuccess.type, payload: clinicalNoteDataMock }]);
      });
    };

    checkGetClinicalNotesListSaga('should fetch data with initial state', clinicalNotesStoreNeededFieldsMock, {
      from: null,
      to: endOfDay(clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters.to),
      types: [],
      patientId: getClinicalNotePayloadMock.patientId,
      userId: null,
    });
    checkGetClinicalNotesListSaga(
      'should fetch data with both date filters selected',
      {
        ...clinicalNotesStoreNeededFieldsMock,
        clinicalNotes: {
          ...clinicalNotesStoreNeededFieldsMock.clinicalNotes,
          filters: {
            ...clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters,
            from: dateMock,
          },
        },
      },
      {
        from: startOfDay(dateMock),
        to: endOfDay(clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters.to),
        types: [],
        patientId: getClinicalNotePayloadMock.patientId,
        userId: null,
      },
    );
    checkGetClinicalNotesListSaga(
      'should fetch data with not custom note type filters selected',
      {
        ...clinicalNotesStoreNeededFieldsMock,
        clinicalNotes: {
          ...clinicalNotesStoreNeededFieldsMock.clinicalNotes,
          filters: {
            ...clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters,
            noteTypes: clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters.noteTypes.map((item, index) => {
              if (index === 1 || index === 3) {
                return { ...item, selected: true };
              }
              return item;
            }),
          },
        },
      },
      {
        from: null,
        to: endOfDay(clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters.to),
        types: clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters.noteTypes
          .filter((item, index) => {
            if (index === 1 || index === 3) {
              return item;
            }
          })
          .map((filteredItem) => ClinicalNoteTypes[filteredItem.name]),
        patientId: getClinicalNotePayloadMock.patientId,
        userId: null,
      },
    );
    checkGetClinicalNotesListSaga(
      'should fetch data with custom note type filter selected',
      {
        ...clinicalNotesStoreNeededFieldsMock,
        clinicalNotes: {
          ...clinicalNotesStoreNeededFieldsMock.clinicalNotes,
          filters: {
            ...clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters,
            noteTypes: clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters.noteTypes.map((item, index) => {
              if (index === 0) {
                return { ...item, selected: true };
              }
              return item;
            }),
          },
        },
      },
      {
        from: null,
        to: endOfDay(clinicalNotesStoreNeededFieldsMock.clinicalNotes.filters.to),
        types: [],
        patientId: getClinicalNotePayloadMock.patientId,
        userId: userIdMock,
      },
    );

    it('should handle error', async () => {
      API.post = jest.fn().mockRejectedValue({ message: 'Error' });
      const dispatched: Action[] = [];

      await runSagaHandler(dispatched, clinicalNotesStoreNeededFieldsMock, getClinicalNotesListSaga, {
        type: getClinicalNotesList.type,
        payload: getClinicalNotePayloadMock,
      });

      expect(dispatched).toEqual([{ type: setClinicalNotesListError.type, payload: { message: 'Error' } }]);
    });
  });

  describe('deleteClinicalNoteSaga', () => {
    it('should correctly delete clinical note', async () => {
      API.delete = jest.fn().mockResolvedValue({});
      const dispatched: Action[] = [];
      const selectedClinicalNoteIdMock = 2;
      const payloadMock = { patientId: 3, place: ClinicalNotesPlaces.Profile };

      await runSagaHandler(
        dispatched,
        { clinicalNotes: { selectedClinicalNoteId: selectedClinicalNoteIdMock } },
        deleteClinicalNoteSaga,
        {
          type: deleteClinicalNote.type,
          payload: payloadMock,
        },
      );

      expect(API.delete).toHaveBeenCalledWith(`/pm/clinical-notes/${selectedClinicalNoteIdMock}`);
      expect(dispatched).toEqual([
        { type: deleteClinicalNoteSuccess },
        {
          type: addSnack.type,
          payload: { type: SnackType.Delete, message: i18n.t('clinicalNotes:form.clinicalNoteDeleted') },
        },
        getClinicalNotesList({ patientId: payloadMock.patientId, place: payloadMock.place }),
      ]);
    });

    it('should correctly handle error', async () => {
      API.delete = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const selectedClinicalNoteIdMock = 2;
      const payloadMock = { patientId: 3 };

      await runSagaHandler(
        dispatched,
        { clinicalNotes: { selectedClinicalNoteId: selectedClinicalNoteIdMock } },
        deleteClinicalNoteSaga,
        {
          type: deleteClinicalNote.type,
          payload: payloadMock,
        },
      );

      expect(dispatched).toEqual([
        { type: addOrEditClinicalNoteError.type, payload: new Error() },
        {
          type: addSnack.type,
          payload: { type: SnackType.Error, message: i18n.t('common:deleteFailed') },
        },
      ]);
    });
  });
});
