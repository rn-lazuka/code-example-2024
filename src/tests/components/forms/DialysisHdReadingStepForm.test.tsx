import { render } from '@unit-tests';
import { DialysisHdReadingStepForm } from '@components/modals/ServiceModal/components/DialysisProcedureModal/components/steps/components/DialysisHdReadingStepForm';
import userEvent from '@testing-library/user-event';
import type { HdReadingDataRequest } from '@types';
import { server } from '@unit-tests/server/serverMock';
import { rest } from 'msw';
import { screen } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';

const commonPartOfFieldId = 'TextInput';

const fieldsId = {
  signedBy: 'signedByFormAutocomplete',
  duringHdNotes: `duringHdNotes${commonPartOfFieldId}`,
  cumHeparin: `cumHeparin${commonPartOfFieldId}`,
  ktV: `ktV${commonPartOfFieldId}`,
  cumUf: `cumUf${commonPartOfFieldId}`,
  dialysateTemp: `dialysateTemp${commonPartOfFieldId}`,
  totalUf: `totalUf${commonPartOfFieldId}`,
  ufRate: `ufRate${commonPartOfFieldId}`,
  heparinRate: `heparinRate${commonPartOfFieldId}`,
  conductivity: `conductivity${commonPartOfFieldId}`,
  systolicBp: `systolicBp${commonPartOfFieldId}`,
  diastolicBp: `diastolicBp${commonPartOfFieldId}`,
  hr: `hr${commonPartOfFieldId}`,
  tmp: `tmp${commonPartOfFieldId}`,
  urr: `urr${commonPartOfFieldId}`,
  vp: `vp${commonPartOfFieldId}`,
  qb: `qb${commonPartOfFieldId}`,
  qd: `qd${commonPartOfFieldId}`,
  ap: `ap${commonPartOfFieldId}`,
};

let fieldsData: Omit<HdReadingDataRequest, 'time'> = {
  signedBy: 'Nurse 1',
  signedById: '1',
  cumUf: 110,
  dialysateTemp: 37.2,
  heparinRate: 700,
  conductivity: 150,
  systolicBp: 60,
  diastolicBp: 90,
  hr: '800',
  tmp: 600,
  vp: 170,
};

const nurses = [
  { id: '1', name: 'Nurse 1', userId: '1' },
  { id: '2', name: 'Nurse 2', userId: '2' },
];
server.use(
  rest.get(`${process.env.DEVELOPMENT_API_TARGET}/pm/nurses`, (req, res, ctx) => {
    return res.once(ctx.status(200), ctx.json(nurses));
  }),
);

describe('DialysisHdReadingStepForm', () => {
  const user = userEvent.setup();

  it('should submit form with correct data', async () => {
    const onSubmit = jest.fn();
    await act(() =>
      render(<DialysisHdReadingStepForm onSubmit={onSubmit} />, {
        preloadedState: { user: { user: { id: '1' } } },
      }),
    );

    const duringHdNotesField = screen.getByTestId(fieldsId.duringHdNotes);
    const cumHeparinField = screen.getByTestId(fieldsId.cumHeparin);
    const ktvField = screen.getByTestId(fieldsId.ktV);
    const cumUfField = screen.getByTestId(fieldsId.cumUf);
    const dialysateTempField = screen.getByTestId(fieldsId.dialysateTemp);
    const totalUfField = screen.getByTestId(fieldsId.totalUf);
    const ufRateField = screen.getByTestId(fieldsId.ufRate);
    const heparinRateField = screen.getByTestId(fieldsId.heparinRate);
    const conductivityField = screen.getByTestId(fieldsId.conductivity);
    const systolicBpField = screen.getByTestId(fieldsId.systolicBp);
    const diastolicBpField = screen.getByTestId(fieldsId.diastolicBp);
    const hrField = screen.getByTestId(fieldsId.hr);
    const tmpField = screen.getByTestId(fieldsId.tmp);
    const urrField = screen.getByTestId(fieldsId.urr);
    const vpField = screen.getByTestId(fieldsId.vp);
    const qbField = screen.getByTestId(fieldsId.qb);
    const qdField = screen.getByTestId(fieldsId.qd);
    const apField = screen.getByTestId(fieldsId.ap);

    expect(apField).toBeInTheDocument();
    expect(ufRateField).toBeInTheDocument();
    expect(qbField).toBeInTheDocument();
    expect(qdField).toBeInTheDocument();
    expect(cumHeparinField).toBeInTheDocument();
    expect(totalUfField).toBeInTheDocument();
    expect(ktvField).toBeInTheDocument();
    expect(urrField).toBeInTheDocument();
    expect(duringHdNotesField).toBeInTheDocument();

    await act(() => user.type(cumUfField, fieldsData.cumUf!.toString()));
    await act(() => user.type(dialysateTempField, fieldsData.dialysateTemp!.toString()));
    await act(() => user.type(heparinRateField, fieldsData.heparinRate!.toString()));
    await act(() => user.type(conductivityField, fieldsData.conductivity!.toString()));
    await act(() => user.type(systolicBpField, fieldsData.systolicBp!.toString()));
    await act(() => user.type(diastolicBpField, fieldsData.diastolicBp!.toString()));
    await act(() => user.type(hrField, fieldsData.hr));
    await act(() => user.type(tmpField, fieldsData.tmp!.toString()));
    await act(() => user.type(vpField, fieldsData.vp!.toString()));

    await act(() => user.click(screen.getByTestId('saveHdReadingFormButton')));

    const enteredData = onSubmit.mock.lastCall[0];
    delete enteredData.time;
    delete enteredData.ap;
    delete enteredData.ufRate;
    delete enteredData.qb;
    delete enteredData.qd;
    delete enteredData.cumHeparin;
    delete enteredData.totalUf;
    delete enteredData.ktV;
    delete enteredData.urr;
    delete enteredData.duringHdNotes;

    expect(onSubmit).toBeCalledWith(fieldsData);
  });
});
