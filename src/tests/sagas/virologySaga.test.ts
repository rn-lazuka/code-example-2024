import type { Action } from 'redux';
import { API } from '@utils/api';
import { runSagaHandler } from '@unit-tests';
import {
  addSnack,
  addVirologyError,
  addVirologyNote,
  addVirologyNoteSuccess,
  editVirologyNote,
  getVirologyList,
  getVirologyListSuccess,
} from '@store/slices';
import { SnackType } from '@enums/components';
import i18n from 'i18next';
import { addVirologyNoteSaga, getVirologyListSaga } from '@sagas/virologySaga';

describe('Virology Saga Tests', () => {
  describe('getVirologyListSaga', () => {
    it('should correctly get virology list', async () => {
      const apiResponseMock = { data: {} };
      API.get = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];
      const payloadMock = '1';

      await runSagaHandler(dispatched, {}, getVirologyListSaga, {
        type: getVirologyList.type,
        payload: payloadMock,
      });

      expect(API.get).toHaveBeenCalledWith(`pm/patients/${payloadMock}/virology`);
      expect(dispatched).toEqual([
        {
          type: getVirologyListSuccess.type,
          payload: apiResponseMock.data,
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.get = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = '1';

      await runSagaHandler(dispatched, {}, getVirologyListSaga, {
        type: getVirologyList.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: addVirologyError.type, payload: new Error() }]);
    });
  });

  describe('addVirologyNoteSaga', () => {
    it('should correctly add note to virology info', async () => {
      const apiResponseMock = { data: {} };
      API.put = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];
      const payloadMock = { patientId: '1', virologyId: '1', note: 'test' };

      await runSagaHandler(dispatched, {}, addVirologyNoteSaga, {
        type: addVirologyNote.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(`pm/patients/${payloadMock.patientId}/virology/${payloadMock.virologyId}`, {
        note: payloadMock.note,
      });
      expect(dispatched).toEqual([
        { type: addVirologyNoteSuccess.type, payload: apiResponseMock.data },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('virology:snack.noteHasBeenCreated') },
        },
      ]);
    });

    it('should correctly edit note to virology info', async () => {
      const apiResponseMock = { data: {} };
      API.put = jest.fn().mockResolvedValue(apiResponseMock);
      const dispatched: Action[] = [];
      const payloadMock = { patientId: '1', virologyId: '1', note: 'test2' };

      await runSagaHandler(dispatched, {}, addVirologyNoteSaga, {
        type: editVirologyNote.type,
        payload: payloadMock,
      });

      expect(API.put).toHaveBeenCalledWith(`pm/patients/${payloadMock.patientId}/virology/${payloadMock.virologyId}`, {
        note: payloadMock.note,
      });
      expect(dispatched).toEqual([
        { type: addVirologyNoteSuccess.type, payload: apiResponseMock.data },
        {
          type: addSnack.type,
          payload: { type: SnackType.Success, message: i18n.t('virology:snack.noteHasBeenChanged') },
        },
      ]);
    });

    it('should correctly handle error', async () => {
      API.put = jest.fn().mockRejectedValue(new Error());
      const dispatched: Action[] = [];
      const payloadMock = { patientId: '1', virologyId: '1', note: 'test' };

      await runSagaHandler(dispatched, {}, addVirologyNoteSaga, {
        type: addVirologyNote.type,
        payload: payloadMock,
      });

      expect(dispatched).toEqual([{ type: addVirologyError.type, payload: new Error() }]);
    });
  });
});
